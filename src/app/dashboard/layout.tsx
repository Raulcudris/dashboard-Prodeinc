import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface DashboardAppLayoutProps {
  children: React.ReactNode;
}

export default function DashboardAppLayout({
  children
}: DashboardAppLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}