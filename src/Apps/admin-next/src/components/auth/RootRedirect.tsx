import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKeycloak } from "@/contexts/KeycloakContext";
import Loading from "@/components/Loading";
import Ecommerce from "@/components/dashboard/ecommerce";

const RootRedirect = () => {
  const router = useRouter();
  const { authenticated, keycloakReady } = useKeycloak();

  useEffect(() => {
    if (!keycloakReady) {
      return;
    }

    if (!authenticated) {
      // If not authenticated, redirect to /login
      // TEMPORARY: Allow access for testing
      // router.push("/login");
    }
  }, [authenticated, keycloakReady, router]);

  // If Keycloak is not ready, show loading
  if (!keycloakReady) {
    return <Loading />;
  }

  // If not authenticated, show loading while redirecting
  if (!authenticated) {
    // TEMPORARY: Allow access for testing
    // return <Loading />;
    console.log("RootRedirect: Proceeding without auth (Test Mode)");
  }

  // If authenticated, load ecommerce page directly
  return <Ecommerce />;
};

export default RootRedirect;
