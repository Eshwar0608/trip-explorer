import { DashboardNav } from "@/components/layout/dashboard-nav";

const navItems = [
  { href: "/dashboard/customer", label: "Overview" },
  { href: "/dashboard/add-place", label: "Add Place" },
  { href: "/dashboard/customer/submissions", label: "My Submissions" },
];

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <p className="text-muted-foreground">
          Submit places and manage your contributions
        </p>
      </div>
      <DashboardNav items={navItems} />
      <div className="mt-8">{children}</div>
    </div>
  );
}
