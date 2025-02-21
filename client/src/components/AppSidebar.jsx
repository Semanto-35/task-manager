import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, ListChecks, Settings, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Tasks", url: "/tasks", icon: ListChecks },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-64 bg-white dark:bg-gray-900 border-r">
      {/* Sidebar Header */}
      <SidebarHeader className="text-2xl font-bold text-center text-gray-800 dark:text-white py-4">
        Task Manager
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 p-3 rounded-md transition ${
                          isActive
                            ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-3">
        <Button variant="destructive" className="w-full flex items-center gap-2">
          <LogOut className="w-5 h-5" /> Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
