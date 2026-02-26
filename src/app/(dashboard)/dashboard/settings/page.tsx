import { getTenant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import OrganizationForm from "./organization-form";

export default async function SettingsPage() {
  const tenant = await getTenant();
  if (!tenant) redirect("/login");
  const org = await prisma.organization.findFirst({
    where: { id: tenant.organizationId, deletedAt: null },
  });
  if (!org) redirect("/dashboard");
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Organization settings</h1>
      <OrganizationForm
        organization={{
          id: org.id,
          name: org.name,
          logo: org.logo,
          gstNumber: org.gstNumber,
          address: org.address,
          phone: org.phone,
          email: org.email,
          bankDetails: org.bankDetails,
          upiId: org.upiId,
          invoicePrefix: org.invoicePrefix,
        }}
      />
    </div>
  );
}
