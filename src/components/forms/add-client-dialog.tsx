"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientSchema, type CreateClientInput } from "@/lib/validations/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

type Client = { id: string; name: string };

export function AddClientDialog({
  onClientAdded,
  triggerLabel = "Add new client",
}: {
  onClientAdded: (client: Client) => void;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      gstin: "",
      billingAddress: "",
      shippingAddress: "",
    },
  });

  async function onSubmit(data: CreateClientInput) {
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const j = await res.json();
      alert(j.error ?? "Failed to create client");
      return;
    }
    const client = await res.json();
    onClientAdded({ id: client.id, name: client.name });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="dialog-name">Name *</Label>
            <Input id="dialog-name" {...register("name")} className="mt-1" />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="dialog-email">Email</Label>
            <Input id="dialog-email" type="email" {...register("email")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="dialog-phone">Phone</Label>
            <Input id="dialog-phone" {...register("phone")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="dialog-gstin">GSTIN</Label>
            <Input id="dialog-gstin" {...register("gstin")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="dialog-billing">Billing address</Label>
            <textarea
              id="dialog-billing"
              {...register("billingAddress")}
              className="mt-1 flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="dialog-shipping">Shipping address</Label>
            <textarea
              id="dialog-shipping"
              {...register("shippingAddress")}
              className="mt-1 flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
