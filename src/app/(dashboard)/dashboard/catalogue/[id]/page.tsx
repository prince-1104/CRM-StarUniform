"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProductSchema, type UpdateProductInput } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
  });

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          router.push("/dashboard/catalogue");
          return;
        }
        reset({
          name: data.name,
          description: data.description ?? "",
          defaultPrice: Number(data.defaultPrice),
          gstPercent: Number(data.gstPercent),
          unit: data.unit,
        });
      })
      .finally(() => setLoading(false));
  }, [id, reset, router]);

  async function onSubmit(data: UpdateProductInput) {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const j = await res.json();
      alert(j.error ?? "Failed to update");
      return;
    }
    router.push("/dashboard/catalogue");
    router.refresh();
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/catalogue">← Catalogue</Link>
        </Button>
        <h1 className="text-2xl font-bold mt-2">Edit product</h1>
      </div>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Product details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} className="mt-1" />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                {...register("description")}
                className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultPrice">Default price (₹)</Label>
                <Input
                  id="defaultPrice"
                  type="number"
                  step="0.01"
                  {...register("defaultPrice", { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="gstPercent">GST %</Label>
                <Input
                  id="gstPercent"
                  type="number"
                  step="0.01"
                  {...register("gstPercent", { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" {...register("unit")} className="mt-1" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/catalogue">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
