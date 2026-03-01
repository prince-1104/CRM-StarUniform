"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientSchema, type CreateClientInput } from "@/lib/validations/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type ClientData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin: string;
  billingAddress: string;
  shippingAddress: string;
};

export function EditClientForm({ client }: { client: ClientData }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: client.name,
      phone: client.phone || "",
      email: client.email || "",
      gstin: client.gstin || "",
      billingAddress: client.billingAddress || "",
      shippingAddress: client.shippingAddress || "",
    },
  });

  async function onSubmit(data: CreateClientInput) {
    const res = await fetch(`/api/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const j = await res.json();
      alert(j.error ?? "Failed to update client");
      return;
    }
    router.push(`/dashboard/clients/${client.id}`);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/clients">← Clients</Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit client</h1>
      </div>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Client details</CardTitle>
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="gstin">GSTIN</Label>
              <Input id="gstin" {...register("gstin")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="billingAddress">Billing address</Label>
              <textarea
                id="billingAddress"
                {...register("billingAddress")}
                className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="shippingAddress">Shipping address</Label>
              <textarea
                id="shippingAddress"
                {...register("shippingAddress")}
                className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/dashboard/clients/${client.id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
