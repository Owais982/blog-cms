"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/ui/Toast";
import { NavigationGuardProvider } from "./NavigationGuard";
import { Sidebar } from "./Sidebar";
import { resolveBreadcrumb, TopBar } from "./TopBar";

const MOBILE_QUERY = "(max-width: 767px)";

function subscribeToViewport(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const isMobileViewport = () => window.matchMedia(MOBILE_QUERY).matches;

/**
 * Persistent chrome around every signed-in screen: sidebar + top bar + scrollable
 * content. The one client boundary in the layout — pages stay Server Components.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Below md the sidebar is an overlay: it starts closed, and closes again on
  // navigation and on Escape. From md up it keeps the user's own choice.
  const isMobile = useSyncExternalStore(subscribeToViewport, isMobileViewport, () => false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  const collapsed = isMobile ? !mobileOpen : desktopCollapsed;

  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMobile, mobileOpen]);

  const toggleSidebar = () => (isMobile ? setMobileOpen((open) => !open) : setDesktopCollapsed((c) => !c));

  return (
    <ToastProvider>
      <NavigationGuardProvider>
        <div className="flex h-screen overflow-hidden">
          {!collapsed && (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-30 cursor-pointer bg-black/30 md:hidden"
            />
          )}
          <div className="relative w-0 shrink-0 md:w-auto">
            <Sidebar collapsed={collapsed} />
          </div>
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <TopBar breadcrumb={resolveBreadcrumb(pathname)} onToggleSidebar={toggleSidebar} />
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </main>
        </div>
      </NavigationGuardProvider>
    </ToastProvider>
  );
}