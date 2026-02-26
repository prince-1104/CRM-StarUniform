"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  FileCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/catalogue", label: "Catalogue", icon: Package },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/quotations", label: "Quotations", icon: FileCheck },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 border-r bg-card min-h-screen flex flex-col">
      <div className="p-4 border-b">
        <Link href="/dashboard" className="font-semibold text-lg">
          Star Uniform
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")))
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-2 border-t space-y-1">
        <div className="flex items-center justify-between gap-2 px-2 py-1">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle variant="ghost" size="icon" />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
