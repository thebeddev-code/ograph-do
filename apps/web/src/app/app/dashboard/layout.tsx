import { ReactNode } from "react";

import { Sidebar } from "@/components/ui/sidebar";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      {children}
    </div>
  );
}
