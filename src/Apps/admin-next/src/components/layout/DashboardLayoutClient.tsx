"use client";
import React, { useEffect, Suspense, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar";
import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import useContentWidth from "@/hooks/useContentWidth";
import useMenulayout from "@/hooks/useMenulayout";
import useMenuHidden from "@/hooks/useMenuHidden";
import Footer from "@/components/partials/footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import MobileMenu from "@/components/partials/sidebar/MobileMenu";
import useMobileMenu from "@/hooks/useMobileMenu";
import MobileFooter from "@/components/partials/footer/MobileFooter";
// import { useSelector } from "react-redux"; // Unused in strict logic below but kept if needed
import Loading from "@/components/Loading";
import { motion, AnimatePresence } from "framer-motion";
import { useKeycloak } from "@/contexts/KeycloakContext";

export default function DashboardLayoutClient({
  children,
}) {
  const { width, breakpoints } = useWidth();
  const [collapsed] = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  // const { isAuth, user } = useSelector((state) => state.auth);
  const { authenticated, keycloakReady } = useKeycloak();

  useEffect(() => {
    if (!keycloakReady) return;

    if (!authenticated) {
      if (
        pathname !== "/login" &&
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/auth")
      ) {
        // TEMPORARY: Allow access for testing
        // router.push("/login");
      }
    }
  }, [authenticated, keycloakReady, router, pathname]);

  const [menuType] = useMenulayout();
  const [menuHidden] = useMenuHidden();

  const switchHeaderClass = () => {
    if (menuType === "horizontal" || menuHidden) {
      return "ltr:ml-0 rtl:mr-0";
    } else if (collapsed) {
      return "ltr:ml-[72px] rtl:mr-[72px]";
    } else {
      return "ltr:ml-[248px] rtl:mr-[248px]";
    }
  };

  const [contentWidth] = useContentWidth();
  const [mobileMenu, setMobileMenu] = useMobileMenu();

  return (
    <>
      <Header className={width > breakpoints.xl ? switchHeaderClass() : ""} />
      {menuType === "vertical" && width > breakpoints.xl && !menuHidden && (
        <Sidebar />
      )}

      <MobileMenu
        className={`${
          width < breakpoints.xl && mobileMenu
            ? "left-0 visible opacity-100  z-9999"
            : "left-[-300px] invisible opacity-0  z-[-999] "
        }`}
      />
      {width < breakpoints.xl && mobileMenu && (
        <div
          className="overlay bg-slate-900/50 backdrop-filter backdrop-blur-xs opacity-100 fixed inset-0 z-999"
          onClick={() => setMobileMenu(false)}></div>
      )}
      <div
        className={`content-wrapper transition-all duration-150 ${
          width > 1280 ? switchHeaderClass() : ""
        }`}>
        <div className="page-content   page-min-height  ">
          <div
            className={
              contentWidth === "boxed" ? "container mx-auto" : "container-fluid"
            }>
            <Suspense fallback={<Loading />}>
              <motion.div
                key={pathname}
                initial="pageInitial"
                animate="pageAnimate"
                exit="pageExit"
                variants={{
                  pageInitial: { opacity: 0, y: 50 },
                  pageAnimate: { opacity: 1, y: 0 },
                  pageExit: { opacity: 0, y: -50 },
                }}
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.5,
                }}>
                <Breadcrumbs />
                {children}
              </motion.div>
            </Suspense>
          </div>
        </div>
      </div>
      {width < breakpoints.md && <MobileFooter />}
      {width > breakpoints.md && (
        <Footer className={width > breakpoints.xl ? switchHeaderClass() : ""} />
      )}
    </>
  );
}
