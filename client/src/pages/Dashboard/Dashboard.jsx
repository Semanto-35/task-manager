import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { LogOut, Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useAuth from "@/hooks/useAuth";



const Dashboard = ({ children }) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);


  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto w-full">
          <div className="flex items-center justify-between p-4 border-b mb-4">
            {/* Sidebar Trigger Button */}
            <SidebarTrigger />

            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <Button
                onClick={() => setDarkMode(!darkMode)}
                variant="outline"
                className="flex items-center gap-2"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {darkMode ? "Light" : "Dark"}
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-ful">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL} alt="User"/>
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>My Account</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* main content */}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
