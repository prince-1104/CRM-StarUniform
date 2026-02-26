"use client";

import { DashboardSidebar } from "./dashboard-sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-content w-full p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
