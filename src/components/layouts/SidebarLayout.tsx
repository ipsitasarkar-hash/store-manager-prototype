import { Outlet, useLocation } from "react-router-dom";
import IconSidebar from "@/components/invoicing/IconSidebar";

const getActiveIndex = (pathname: string): number => {
  if (pathname.startsWith("/spaces")) return 1;
  if (pathname.startsWith("/invoice") || pathname.startsWith("/duplicate")) return 1;
  return 0;
};

const SidebarLayout = () => {
  const { pathname } = useLocation();
  const activeIndex = getActiveIndex(pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      <IconSidebar activeIndex={activeIndex} />
      <Outlet />
    </div>
  );
};

export default SidebarLayout;
