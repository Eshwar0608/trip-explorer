import { DashboardNav } from "@/components/layout/dashboard-nav";

const navItems = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/pending", label: "Pending Places" },
  { href: "/dashboard/admin/approved", label: "Approved Places" },
  { href: "/dashboard/admin/reviews", label: "Manage Reviews" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Approve places, manage content, and moderate reviews
        </p>
      </div>
      <DashboardNav items={navItems} />
      <div className="mt-8">{children}</div>
    </div>
  );
}
