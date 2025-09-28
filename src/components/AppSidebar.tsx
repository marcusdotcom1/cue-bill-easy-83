import { Circle, BarChart3, Users, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const tableItems = [
  { title: "Table 1", url: "/table/1", icon: Circle },
  { title: "Table 2", url: "/table/2", icon: Circle },
  { title: "Table 3", url: "/table/3", icon: Circle },
  { title: "Table 4", url: "/table/4", icon: Circle },
];

const managementItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary border-l-2 border-primary font-medium" : "hover:bg-secondary/50";

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"}>
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        {/* Tables Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-neon font-semibold">
            🎱 Tables
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tableItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-golden font-semibold">
            📊 Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}