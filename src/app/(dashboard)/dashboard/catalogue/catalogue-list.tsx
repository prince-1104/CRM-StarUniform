"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Product = {
  id: string;
  name: string;
  defaultPrice: { toString(): string };
  gstPercent: { toString(): string };
  unit: string;
};

export default function CatalogueList({
  products,
  page,
  totalPages,
  total,
  search,
}: {
  products: Product[];
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
    router.push(`/dashboard/catalogue?search=${encodeURIComponent(q)}&page=1`);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
        <Input name="search" placeholder="Search products" defaultValue={search} />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>
      {products.length === 0 ? (
        <p className="text-muted-foreground">No products yet. Add your first product.</p>
      ) : (
        <>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3">Name</th>
                  <th className="text-right p-3">Price</th>
                  <th className="text-right p-3">GST %</th>
                  <th className="text-left p-3">Unit</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-right">₹{Number(p.defaultPrice).toFixed(2)}</td>
                    <td className="p-3 text-right">{Number(p.gstPercent)}%</td>
                    <td className="p-3">{p.unit}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/catalogue/${p.id}`}>Edit</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Page {page} of {totalPages} ({total} total)</span>
            <div className="flex gap-2">
              {page > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/dashboard/catalogue?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  >
                    Previous
                  </Link>
                </Button>
              )}
              {page < totalPages && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/dashboard/catalogue?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
