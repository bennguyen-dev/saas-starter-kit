import { ReactNode } from "react";
import DashboardLayout from "@/shared/components/layouts/dashboard/layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
