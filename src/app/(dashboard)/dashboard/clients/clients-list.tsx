"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

export default function ClientsList({
  clients,
  page,
  totalPages,
  total,
  search,
}: {
  clients: Client[];
  page: number;
  totalPages: number;
  total: number;
  search: string;
}) {
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("search") as HTMLInputElement)?.value ?? "";
    router.push(`/dashboard/clients?search=${encodeURIComponent(q)}&page=1`);
  }

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{ single: string | null; bulk: boolean }>({
    single: null,
    bulk: false,
  });
  const [deleting, setDeleting] = useState(false);

  const allIds = clients.map((c) => c.id);
  const isAllSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (isAllSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(allIds));
  }, [isAllSelected, allIds]);

  async function handleDeleteSingle(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json();
        alert(j.error ?? "Failed to delete");
        return;
      }
      setDeleteConfirm({ single: null, bulk: false });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  async function handleBulkDelete() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/clients/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) {
        const j = await res.json();
        alert(j.error ?? "Failed to delete");
        return;
      }
      setDeleteConfirm({ single: null, bulk: false });
      setSelectedIds(new Set());
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
          <Input
            name="search"
            placeholder="Search by name or email"
            defaultValue={search}
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        {selectedIds.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteConfirm({ single: null, bulk: true })}
          >
            Delete selected ({selectedIds.size})
          </Button>
        )}
      </div>
      {clients.length === 0 ? (
        <p className="text-muted-foreground">No clients yet. Add your first client.</p>
      ) : (
        <>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground w-10">
                    <input
                      type="checkbox"
                      className="rounded border-input"
                      aria-label="Select all"
                      checked={isAllSelected}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Phone</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        aria-label={`Select ${c.name}`}
                        checked={selectedIds.has(c.id)}
                        onChange={() => toggleOne(c.id)}
                      />
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/dashboard/clients/${c.id}`}
                        className="font-medium hover:underline"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="p-3">{c.email ?? "—"}</td>
                    <td className="p-3">{c.phone ?? "—"}</td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/clients/${c.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/clients/${c.id}/edit`}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteConfirm({ single: c.id, bulk: false })}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ConfirmDialog
            open={deleteConfirm.single !== null}
            onOpenChange={(open) => !open && setDeleteConfirm((p) => ({ ...p, single: null }))}
            title="Delete client?"
            description="This action cannot be undone."
            confirmLabel="Delete"
            variant="destructive"
            loading={deleting}
            onConfirm={() => deleteConfirm.single && handleDeleteSingle(deleteConfirm.single)}
          />
          <ConfirmDialog
            open={deleteConfirm.bulk}
            onOpenChange={(open) => !open && setDeleteConfirm((p) => ({ ...p, bulk: false }))}
            title="Delete selected clients?"
            description={`You are about to delete ${selectedIds.size} client(s). This cannot be undone.`}
            confirmLabel="Delete all"
            variant="destructive"
            loading={deleting}
            onConfirm={handleBulkDelete}
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {totalPages} ({total} total)
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/dashboard/clients?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  >
                    Previous
                  </Link>
                </Button>
              )}
              {page < totalPages && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/dashboard/clients?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  >
                    Next
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
