"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

/** Fixed theme toggle on landing and auth; dashboard has its own in sidebar. */
export function ThemeToggleGlobal() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  if (isDashboard) return null;
  return (
    <div className="fixed top-4 right-4 z-50">
      <ThemeToggle variant="outline" size="icon" className="rounded-full shadow-md bg-background/80 backdrop-blur" />
    </div>
  );
}
