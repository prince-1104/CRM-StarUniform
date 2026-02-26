"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  return (
    <div className="space-y-4">
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
      {clients.length === 0 ? (
        <p className="text-muted-foreground">No clients yet. Add your first client.</p>
      ) : (
        <>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Phone</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
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
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/clients/${c.id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
