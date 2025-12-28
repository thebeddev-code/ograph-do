import { ReactNode } from "react";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default AppLayout;
