"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type Keycloak from "keycloak-js";
import type {
  KeycloakLoginOptions,
  KeycloakLogoutOptions,
} from "keycloak-js";
import {
  initKeycloak,
  getKeycloak,
  isAuthenticated,
  getUserInfo,
  updateToken,
  login as keycloakLogin,
  logout as keycloakLogout,
  loadUserProfile,
} from "@/services/keycloakService";
import { setUser, logOut } from "@/store/api/auth/authSlice";
import Loading from "@/components/Loading";
import type { User } from "@/types";

/**
 * Keycloak Context State Interface
 */
interface KeycloakContextState {
  /** Whether Keycloak has been initialized */
  keycloakReady: boolean;
  /** Whether the user is authenticated */
  authenticated: boolean;
}

/**
 * Keycloak Context Value Interface
 * Includes state and methods for authentication
 */
interface KeycloakContextValue extends KeycloakContextState {
  /** Login function - redirects to Keycloak login */
  login: (options?: KeycloakLoginOptions) => void;
  /** Logout function - redirects to Keycloak logout */
  logout: (options?: KeycloakLogoutOptions) => void;
  /** Get the Keycloak instance */
  getKeycloak: () => Keycloak;
  /** Get current user info from Keycloak */
  getUserInfo: () => User | null;
  /** Update/refresh the access token */
  updateToken: (minValidity?: number) => Promise<boolean>;
}

/**
 * Keycloak Provider Props Interface
 */
interface KeycloakProviderProps {
  /** Child components */
  children: ReactNode;
}

// Create the context with undefined as initial value
const KeycloakContext = createContext<KeycloakContextValue | undefined>(
  undefined
);

/**
 * Custom hook to use Keycloak context
 * @returns KeycloakContextValue
 * @throws Error if used outside of KeycloakProvider
 */
export const useKeycloak = (): KeycloakContextValue => {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error("useKeycloak must be used within a KeycloakProvider");
  }
  return context;
};

/**
 * Keycloak Provider Component
 * Manages Keycloak initialization and authentication state
 */
export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({
  children,
}) => {
  const [keycloakReady, setKeycloakReady] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const tokenRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Keycloak
  useEffect(() => {
    const initializeKeycloak = async (): Promise<void> => {
      try {
        // TEMPORARY: Mock Auth for testing
        if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
          // Force true for now as requested
          console.log("Keycloak: Using MOCK authentication");
          setKeycloakReady(true);
          setAuthenticated(true);
          dispatch(
            setUser({
              id: "mock-user-id",
              username: "testuser",
              email: "test@example.com",
              firstName: "Test",
              lastName: "User",
              name: "Test User",
              roles: ["admin"],
            })
          );
          setLoading(false);
          return;
        }

        setLoading(true);

        // Try to initialize Keycloak
        await initKeycloak({
          onLoad: "check-sso",
          checkLoginIframe: false,
        });

        // initResult can be:
        // - true: authenticated
        // - false: not authenticated but initialization successful (can still login)
        // - throws error: initialization failed (server not accessible, wrong config, etc.)

        // Get the keycloak instance
        let keycloak: Keycloak;
        try {
          keycloak = getKeycloak();
        } catch (error) {
          console.error("Failed to get Keycloak instance:", error);
          setLoading(false);
          setKeycloakReady(false);
          return;
        }

        // Verify keycloak is a valid object before setting event handlers
        if (!keycloak || typeof keycloak !== "object") {
          console.error("Invalid Keycloak instance");
          setLoading(false);
          setKeycloakReady(false);
          return;
        }

        setKeycloakReady(true);
        setAuthenticated(keycloak.authenticated || false);

        // If authenticated, sync user info with Redux
        // Use retry logic in case tokenParsed isn't ready yet
        if (keycloak.authenticated) {
          const syncUserInfo = async (
            retries: number = 3,
            delay: number = 100
          ): Promise<void> => {
            for (let i = 0; i < retries; i++) {
              // Wait a bit for tokenParsed to be available
              if (i > 0) {
                await new Promise((resolve) => setTimeout(resolve, delay));
              }

              const userInfo = getUserInfo();
              if (userInfo) {
                dispatch(setUser(userInfo));
                localStorage.setItem("user", JSON.stringify(userInfo));
                return;
              }

              // If tokenParsed is still not available, try loading user profile as fallback
              if (i === retries - 1 && keycloak.tokenParsed === undefined) {
                try {
                  const profile = await loadUserProfile();
                  if (profile) {
                    const fallbackUserInfo: User = {
                      id: profile.id || keycloak.subject || "unknown",
                      username:
                        profile.username ||
                        profile.preferred_username ||
                        "user",
                      email: profile.email || "",
                      firstName: profile.firstName || profile.given_name || "",
                      lastName: profile.lastName || profile.family_name || "",
                      name:
                        profile.firstName && profile.lastName
                          ? `${profile.firstName} ${profile.lastName}`
                          : profile.name || "",
                      roles: [],
                    };
                    dispatch(setUser(fallbackUserInfo));
                    localStorage.setItem(
                      "user",
                      JSON.stringify(fallbackUserInfo)
                    );
                  }
                } catch (error) {
                  console.warn("Failed to load user profile:", error);
                }
              }
            }
          };

          syncUserInfo();
        }

        // Set up event listeners only if keycloak is valid
        if (keycloak && typeof keycloak === "object") {
          keycloak.onAuthSuccess = async (): Promise<void> => {
            setAuthenticated(true);
            // Set cookie for middleware
            document.cookie =
              "auth_status=authenticated; path=/; max-age=86400; SameSite=Lax";

            // Retry getting user info in case tokenParsed isn't ready yet
            const syncUserInfo = async (
              retries: number = 3,
              delay: number = 100
            ): Promise<void> => {
              for (let i = 0; i < retries; i++) {
                if (i > 0) {
                  await new Promise((resolve) => setTimeout(resolve, delay));
                }

                const userInfo = getUserInfo();
                if (userInfo) {
                  dispatch(setUser(userInfo));
                  localStorage.setItem("user", JSON.stringify(userInfo));
                  return;
                }
              }
            };

            await syncUserInfo();
          };

          keycloak.onAuthError = (): void => {
            setAuthenticated(false);
            dispatch(logOut());
            localStorage.removeItem("user");
            document.cookie = "auth_status=; path=/; max-age=0";
          };

          keycloak.onAuthLogout = (): void => {
            setAuthenticated(false);
            dispatch(logOut());
            localStorage.removeItem("user");
            document.cookie = "auth_status=; path=/; max-age=0";
            router.push("/login");
          };

          keycloak.onTokenExpired = (): void => {
            updateToken().catch(() => {
              // If token refresh fails, logout
              if (keycloak && typeof keycloak.logout === "function") {
                keycloak.logout();
              }
            });
          };

          // Set up token refresh interval
          tokenRefreshIntervalRef.current = setInterval(() => {
            if (keycloak && keycloak.authenticated) {
              updateToken(30).catch(() => {
                if (tokenRefreshIntervalRef.current) {
                  clearInterval(tokenRefreshIntervalRef.current);
                  tokenRefreshIntervalRef.current = null;
                }
              });
            }
          }, 60000); // Check every minute
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to initialize Keycloak:", error);
        setLoading(false);
        setKeycloakReady(false);
      }
    };

    initializeKeycloak();

    // Cleanup function - runs when component unmounts or dependencies change
    return () => {
      if (tokenRefreshIntervalRef.current) {
        clearInterval(tokenRefreshIntervalRef.current);
        tokenRefreshIntervalRef.current = null;
      }
    };
  }, [dispatch, router]);

  const login = useCallback(
    (options: KeycloakLoginOptions = {}): void => {
      // Check for Mock Auth
      if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
        console.log("Keycloak: Mock login");
        setAuthenticated(true);
        dispatch(
          setUser({
            id: "mock-user-id",
            username: "testuser",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            name: "Test User",
            roles: ["admin"],
          })
        );
        return;
      }
      keycloakLogin(options);
    },
    [dispatch]
  );

  const logout = useCallback(
    (options: KeycloakLogoutOptions = {}): void => {
      // Check for Mock Auth
      if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
        console.log("Keycloak: Mock logout");
        setAuthenticated(false);
        dispatch(logOut());
        router.push("/login"); // Redirect to login page
        return;
      }
      keycloakLogout(options);
    },
    [dispatch, router]
  );

  const value: KeycloakContextValue = {
    keycloakReady,
    authenticated,
    login,
    logout,
    getKeycloak,
    getUserInfo,
    updateToken,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  );
};

export default KeycloakContext;
