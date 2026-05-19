import DashboardShell from "@/components/dashboard/dashboardShell";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}