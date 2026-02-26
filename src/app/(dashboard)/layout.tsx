import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user?.organizationId) redirect("/login");
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
