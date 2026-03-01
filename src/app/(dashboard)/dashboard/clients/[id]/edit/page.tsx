import { getTenant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditClientForm } from "./edit-client-form";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tenant = await getTenant();
  if (!tenant) return null;
  const { id } = await params;
  const client = await prisma.client.findFirst({
    where: { id, organizationId: tenant.organizationId, deletedAt: null },
  });
  if (!client) notFound();

  return (
    <EditClientForm
      client={{
        id: client.id,
        name: client.name,
        email: client.email ?? "",
        phone: client.phone ?? "",
        gstin: client.gstin ?? "",
        billingAddress: client.billingAddress ?? "",
        shippingAddress: client.shippingAddress ?? "",
      }}
    />
  );
}
