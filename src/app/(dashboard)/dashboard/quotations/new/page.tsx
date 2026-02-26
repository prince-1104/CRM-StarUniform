import { redirect } from "next/navigation";
import { getTenant } from "@/lib/auth";
import { getCachedClientList, getCachedProductList } from "@/lib/cached-queries";
import { NewQuotationForm } from "./new-quotation-form";

export default async function NewQuotationPage({
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
    <NewQuotationForm
      clients={clients}
      products={products}
      preselectedClientId={searchParams.clientId}
    />
  );
}
