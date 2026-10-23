"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/ui/Toast";
import { NavigationGuardProvider } from "./NavigationGuard";
import { Sidebar } from "./Sidebar";
import { resolveBreadcrumb, TopBar } from "./TopBar";

/**
 * Persistent chrome around every signed-in screen: sidebar + top bar + scrollable
 * content. The one client boundary in the layout — pages stay Server Components.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <ToastProvider>
      <NavigationGuardProvider>
        <div className="flex h-screen overflow-hidden">
          {!collapsed && (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setCollapsed(true)}
              className="fixed inset-0 z-30 cursor-pointer bg-black/30 md:hidden"
            />
          )}
          <div className="relative w-[var(--shell-sidebar-w-collapsed)] shrink-0 md:w-auto">
            <Sidebar collapsed={collapsed} />
          </div>
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <TopBar
              breadcrumb={resolveBreadcrumb(pathname)}
              onToggleSidebar={() => setCollapsed((c) => !c)}
            />
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </main>
        </div>
      </NavigationGuardProvider>
    </ToastProvider>
  );
}
