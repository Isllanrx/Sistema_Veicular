import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="flex">
        <div className="hidden border-r bg-muted/40 md:block md:w-64">
          <Sidebar className="fixed h-screen" />
        </div>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
} 