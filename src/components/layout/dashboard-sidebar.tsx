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
  BarChart3,
  CreditCard,
  PanelLeftClose,
  PanelLeft,
  Plus,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUIStore } from "@/stores/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/quotations", label: "Quotations", icon: FileCheck },
  { href: "/dashboard/catalogue", label: "Products / Catalogue", icon: Package },
];

const secondaryNav = [
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const quickCreateLinks = [
  { href: "/dashboard/invoices/new", label: "Invoice" },
  { href: "/dashboard/clients/new", label: "Client" },
  { href: "/dashboard/catalogue/new", label: "Product" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-[width] duration-200",
        collapsed ? "w-[52px]" : "w-56"
      )}
    >
      {/* Logo + collapse */}
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3">
        {!collapsed && (
          <Link href="/dashboard" className="font-semibold text-foreground">
            Star Uniform
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Quick Create */}
      <div className="p-2 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={cn("w-full", collapsed && "w-9 px-0")} size="sm">
              <Plus className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="ml-2">Quick Create</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {quickCreateLinks.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              collapsed && "justify-center px-2",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent text-foreground"
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && item.label}
          </Link>
        ))}

        <div className="my-2 h-px bg-border" />

        {secondaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              collapsed && "justify-center px-2",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent text-muted-foreground hover:text-foreground"
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom: theme + log out */}
      <div className="border-t p-2 space-y-1">
        <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "justify-between px-2 py-1")}>
          {!collapsed && <span className="text-xs text-muted-foreground">Theme</span>}
          <ThemeToggle variant="ghost" size="icon" />
        </div>
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-2", collapsed && "w-9 justify-center px-0")}
          onClick={() => signOut({ callbackUrl: "/" })}
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && "Log out"}
        </Button>
      </div>
    </aside>
  );
}
