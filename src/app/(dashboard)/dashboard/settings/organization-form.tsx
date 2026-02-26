"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Org = {
  id: string;
  name: string | null;
  logo: string | null;
  gstNumber: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  bankDetails: string | null;
  upiId: string | null;
  invoicePrefix: string;
};

export default function OrganizationForm({ organization }: { organization: Org }) {
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: organization.name ?? "",
      gstNumber: organization.gstNumber ?? "",
      address: organization.address ?? "",
      phone: organization.phone ?? "",
      email: organization.email ?? "",
      bankDetails: organization.bankDetails ?? "",
      upiId: organization.upiId ?? "",
      invoicePrefix: organization.invoicePrefix ?? "INV",
    },
  });

  async function onSubmit(data: Record<string, string>) {
    const res = await fetch(`/api/organization`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        gstNumber: data.gstNumber || null,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        bankDetails: data.bankDetails || null,
        upiId: data.upiId || null,
        invoicePrefix: data.invoicePrefix || "INV",
      }),
    });
    if (!res.ok) {
      const j = await res.json();
      alert(j.error ?? "Failed to update");
      return;
    }
    router.refresh();
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Business details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Business name</Label>
            <Input id="name" {...register("name")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="gstNumber">GST number</Label>
            <Input id="gstNumber" {...register("gstNumber")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              {...register("address")}
              className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="bankDetails">Bank details</Label>
            <textarea
              id="bankDetails"
              {...register("bankDetails")}
              className="mt-1 flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Bank name, account no., IFSC"
            />
          </div>
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input id="upiId" {...register("upiId")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="invoicePrefix">Invoice prefix</Label>
            <Input id="invoicePrefix" {...register("invoicePrefix")} className="mt-1" placeholder="INV" />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
