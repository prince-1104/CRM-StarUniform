"use client";

import { useSession, signOut } from "next-auth/react";
import { Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Topbar({ className }: { className?: string }) {
  const { data: session } = useSession();

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4",
        className
      )}
    >
      {/* Global search — placeholder for Cmd+K */}
      <button
        type="button"
        className="flex flex-1 max-w-md items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span>Search...</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 py-0.5 text-xs font-mono sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 pl-2 pr-1"
              aria-label="User menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden max-w-[120px] truncate text-sm sm:inline">
                {session?.user?.name ?? session?.user?.email ?? "Account"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-medium">
              {session?.user?.name ?? "User"}
            </div>
            {session?.user?.email && (
              <div className="px-2 py-0.5 text-xs text-muted-foreground">
                {session.user.email}
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
