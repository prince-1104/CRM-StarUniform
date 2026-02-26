import { redirect } from "next/navigation";
import { getTenant } from "@/lib/auth";
import { getCachedClientList, getCachedProductList } from "@/lib/cached-queries";
import { NewInvoiceForm } from "./new-invoice-form";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: { clientId?: string };
}) {
  const tenant = await getTenant();
  if (!tenant) redirect("/login");

  const [clients, products] = await Promise.all([
    getCachedClientList(tenant.organizationId),
    getCachedProductList(tenant.organizationId),
  ]);

  return (
    <NewInvoiceForm
      clients={clients}
      products={products}
      preselectedClientId={searchParams.clientId}
    />
  );
}
