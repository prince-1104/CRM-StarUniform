"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type CreateProductInput } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      defaultPrice: 0,
      gstPercent: 18,
      unit: "pcs",
    },
  });

  async function onSubmit(data: CreateProductInput) {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const j = await res.json();
      alert(j.error ?? "Failed to create product");
      return;
    }
    router.push("/dashboard/catalogue");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/catalogue">← Catalogue</Link>
        </Button>
        <h1 className="text-2xl font-bold mt-2">New product</h1>
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
                <Label htmlFor="defaultPrice">Default price (₹) *</Label>
                <Input
                  id="defaultPrice"
                  type="number"
                  step="0.01"
                  {...register("defaultPrice", { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.defaultPrice && (
                  <p className="text-xs text-destructive mt-1">{errors.defaultPrice.message}</p>
                )}
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
              <Input id="unit" {...register("unit")} className="mt-1" placeholder="pcs, kg, etc." />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating…" : "Create product"}
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
