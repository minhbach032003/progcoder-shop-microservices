/**
 * Keycloak Service
 * Authentication and authorization service using Keycloak
 */

import Keycloak, {
  KeycloakConfig,
  KeycloakInitOptions,
  KeycloakLoginOptions,
  KeycloakLogoutOptions,
  KeycloakTokenParsed,
  KeycloakProfile,
  KeycloakError,
} from "keycloak-js";
import {
  User,
  KeycloakInitOptions as AppKeycloakInitOptions,
} from "@/types";

// Get configuration from environment variables
const keycloakConfig: KeycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "your-realm-name",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "your-client-id",
};

const redirectUri: string =
  process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI ||
  (typeof window !== "undefined" ? window.location.origin + "/ecommerce" : "");

// Log configuration for debugging (only in development)
if (process.env.NODE_ENV === "development") {
  console.log("Keycloak Configuration:", {
    url: keycloakConfig.url,
    realm: keycloakConfig.realm,
    clientId: keycloakConfig.clientId,
    redirectUri,
  });
}

// ==================== Cookie Helper Functions ====================

/**
 * Set a cookie
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Expiration in days (default: 1 day)
 */
const setCookie = (name: string, value: string, days: number = 1): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;

  // Set secure flag only in production (HTTPS)
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax${secure}`;

  if (process.env.NODE_ENV === "development") {
    console.log(`Cookie set: ${name}`);
  }
};

/**
 * Delete a cookie
 * @param name - Cookie name
 */
const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

  if (process.env.NODE_ENV === "development") {
    console.log(`Cookie deleted: ${name}`);
  }
};

/**
 * Set access token cookie
 * @param token - Access token value
 */
const setAccessTokenCookie = (token: string | undefined): void => {
  if (token) {
    // Set cookie to expire in 1 day (token refresh will update it)
    setCookie("access_token", token, 1);
  }
};

/**
 * Delete access token cookie
 */
const deleteAccessTokenCookie = (): void => {
  deleteCookie("access_token");
};

// ==================== Keycloak Instance ====================

// Initialize Keycloak instance
let keycloakInstance: Keycloak | null = null;

/**
 * Initialize Keycloak
 * @param initOptions - Keycloak initialization options
 * @returns Promise that resolves when Keycloak is initialized
 */
export const initKeycloak = (
  initOptions: AppKeycloakInitOptions = {}
): Promise<boolean> => {
  if (keycloakInstance) {
    return Promise.resolve(keycloakInstance.authenticated || false);
  }

  keycloakInstance = new Keycloak(keycloakConfig);

  // Set up event callbacks
  keycloakInstance.onAuthSuccess = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Keycloak: Authentication successful");
    }
    // Set access token cookie on successful authentication
    if (keycloakInstance?.token) {
      setAccessTokenCookie(keycloakInstance.token);
    }
  };

  keycloakInstance.onAuthRefreshSuccess = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Keycloak: Token refresh successful");
    }
    // Update access token cookie after refresh
    if (keycloakInstance?.token) {
      setAccessTokenCookie(keycloakInstance.token);
    }
  };

  keycloakInstance.onAuthLogout = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Keycloak: User logged out");
    }
    // Delete access token cookie on logout
    deleteAccessTokenCookie();
  };

  keycloakInstance.onTokenExpired = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Keycloak: Token expired, attempting refresh...");
    }
    // Try to refresh the token
    keycloakInstance
      ?.updateToken(30)
      .then((refreshed: boolean) => {
        if (refreshed) {
          if (process.env.NODE_ENV === "development") {
            console.log("Keycloak: Token refreshed successfully");
          }
          setAccessTokenCookie(keycloakInstance?.token);
        }
      })
      .catch(() => {
        console.warn(
          "Keycloak: Failed to refresh token, user may need to re-login"
        );
        deleteAccessTokenCookie();
      });
  };

  keycloakInstance.onAuthError = (errorData?: KeycloakError | undefined) => {
    console.error("Keycloak: Authentication error", errorData);
    deleteAccessTokenCookie();
  };

  const defaultInitOptions: KeycloakInitOptions = {
    onLoad: "check-sso",
    checkLoginIframe: false,
    pkceMethod: "S256",
    // Ensure we use the configured redirect URI
    redirectUri,
  };

  const finalInitOptions: KeycloakInitOptions = {
    ...defaultInitOptions,
    ...initOptions,
  };

  // Log for debugging
  if (process.env.NODE_ENV === "development") {
    console.log("Initializing Keycloak with options:", {
      ...finalInitOptions,
      // Don't log the full redirectUri if it's very long
      redirectUri: finalInitOptions.redirectUri,
    });
  }

  return keycloakInstance.init(finalInitOptions).then((authenticated: boolean) => {
    if (authenticated && keycloakInstance?.token) {
      // Set access token cookie if already authenticated (e.g., SSO)
      setAccessTokenCookie(keycloakInstance.token);
      if (process.env.NODE_ENV === "development") {
        console.log("Keycloak: User is authenticated via SSO");
      }
    } else {
      // Make sure cookie is cleared if not authenticated
      deleteAccessTokenCookie();
    }
    return authenticated;
  });
};

/**
 * Get Keycloak instance
 * @returns Keycloak instance
 */
export const getKeycloak = (): Keycloak => {
  if (!keycloakInstance) {
    throw new Error(
      "Keycloak has not been initialized. Call initKeycloak() first."
    );
  }
  return keycloakInstance;
};

/**
 * Get default redirect URI from config
 * @returns Redirect URI
 */
export const getRedirectUri = (): string => {
  return redirectUri;
};

/**
 * Login - Redirect to Keycloak login page
 * @param options - Login options (redirectUri, etc.)
 */
export const login = (options: KeycloakLoginOptions = {}): void => {
  const keycloak = getKeycloak();
  const loginRedirectUri = (options.redirectUri as string) || redirectUri;

  // Log for debugging
  if (process.env.NODE_ENV === "development") {
    console.log("Keycloak login called with redirectUri:", loginRedirectUri);
  }

  keycloak.login({
    redirectUri: loginRedirectUri,
    ...options,
  });
};

/**
 * Logout - Logout and redirect to Keycloak logout page
 * @param options - Logout options (redirectUri, etc.)
 */
export const logout = (options: KeycloakLogoutOptions = {}): void => {
  const keycloak = getKeycloak();

  // Delete access token cookie before logout
  deleteAccessTokenCookie();

  const logoutRedirectUri =
    (options.redirectUri as string) ||
    (typeof window !== "undefined" ? window.location.origin : "");

  keycloak.logout({
    redirectUri: logoutRedirectUri,
    ...options,
  });
};

/**
 * Check if user is authenticated
 * @returns True if authenticated
 */
export const isAuthenticated = (): boolean => {
  const keycloak = getKeycloak();
  return keycloak.authenticated || false;
};

/**
 * Get access token
 * @returns Access token or null
 */
export const getToken = (): string | null => {
  const keycloak = getKeycloak();
  return keycloak.token || null;
};

/**
 * Get refresh token
 * @returns Refresh token or null
 */
export const getRefreshToken = (): string | null => {
  const keycloak = getKeycloak();
  return keycloak.refreshToken || null;
};

/**
 * Get user info from Keycloak token
 * @returns User info object or null
 */
export const getUserInfo = (): User | null => {
  const keycloak = getKeycloak();
  if (!keycloak.authenticated) {
    return null;
  }

  // If tokenParsed is available, use it
  if (keycloak.tokenParsed) {
    const tokenParsed = keycloak.tokenParsed as KeycloakTokenParsed;
    return {
      id: tokenParsed.sub || keycloak.subject || "unknown",
      username:
        tokenParsed.preferred_username || tokenParsed.username || "user",
      email: tokenParsed.email || "",
      firstName: tokenParsed.given_name || "",
      lastName: tokenParsed.family_name || "",
      name:
        tokenParsed.name ||
        (tokenParsed.given_name && tokenParsed.family_name
          ? `${tokenParsed.given_name} ${tokenParsed.family_name}`
          : tokenParsed.preferred_username || "User"),
      roles: tokenParsed.realm_access?.roles || [],
      ...tokenParsed,
    };
  }

  // Fallback: if tokenParsed is not available but we have a token, try to decode it
  // or return a minimal user object based on available info
  if (keycloak.token) {
    try {
      // Try to decode JWT token manually as fallback
      const base64Url = keycloak.token.split(".")[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const decoded = JSON.parse(jsonPayload) as KeycloakTokenParsed;

        return {
          id: decoded.sub || keycloak.subject || "unknown",
          username: decoded.preferred_username || decoded.username || "user",
          email: decoded.email || "",
          firstName: decoded.given_name || "",
          lastName: decoded.family_name || "",
          name:
            decoded.name ||
            (decoded.given_name && decoded.family_name
              ? `${decoded.given_name} ${decoded.family_name}`
              : decoded.preferred_username || "User"),
          roles: decoded.realm_access?.roles || [],
          ...decoded,
        };
      }
    } catch (error) {
      console.warn("Failed to decode token manually:", error);
    }
  }

  // Last resort: return minimal user object if we have subject
  if (keycloak.subject) {
    return {
      id: keycloak.subject,
      username: "user",
      email: "",
      firstName: "",
      lastName: "",
      name: "User",
      roles: [],
    };
  }

  return null;
};

/**
 * Update token - Refresh the access token
 * @param minValidity - Minimum validity in seconds
 * @returns Promise that resolves with boolean indicating if token was updated
 */
export const updateToken = (minValidity: number = 5): Promise<boolean> => {
  const keycloak = getKeycloak();
  return keycloak.updateToken(minValidity).then((refreshed: boolean) => {
    if (refreshed && keycloak.token) {
      // Update access token cookie after successful refresh
      setAccessTokenCookie(keycloak.token);
    }
    return refreshed;
  });
};

/**
 * Check if token is expired or will expire soon
 * @param minValidity - Minimum validity in seconds
 * @returns True if token needs refresh
 */
export const isTokenExpired = (minValidity: number = 5): boolean => {
  const keycloak = getKeycloak();
  return keycloak.isTokenExpired(minValidity);
};

/**
 * Load user profile from Keycloak
 * @returns Promise that resolves with user profile
 */
export const loadUserProfile = (): Promise<KeycloakProfile> => {
  const keycloak = getKeycloak();
  return keycloak.loadUserProfile();
};
