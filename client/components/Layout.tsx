import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth, UserRole, ProtectedComponent } from "@/contexts/AuthContext";
import {
  Activity,
  Calendar,
  Users,
  Pill,
  TestTube,
  Camera,
  DollarSign,
  UserCheck,
  Package,
  GraduationCap,
  BarChart3,
  Menu,
  X,
  Heart,
  Stethoscope,
  Plus,
  LogOut,
  User,
  Settings,
  ChevronDown
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart3,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST, UserRole.PHARMACIST, UserRole.LAB_TECH, UserRole.RADIOLOGIST, UserRole.FINANCE, UserRole.RESEARCHER]
  },
  {
    name: "Patients",
    href: "/patients",
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST, UserRole.PHARMACIST, UserRole.LAB_TECH, UserRole.RADIOLOGIST, UserRole.FINANCE]
  },
  {
    name: "Appointments",
    href: "/appointments",
    icon: Calendar,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST]
  },
  {
    name: "Pharmacy",
    href: "/pharmacy",
    icon: Pill,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PHARMACIST]
  },
  {
    name: "Laboratory",
    href: "/laboratory",
    icon: TestTube,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECH]
  },
  {
    name: "Radiology",
    href: "/radiology",
    icon: Camera,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RADIOLOGIST]
  },
  {
    name: "Billing",
    href: "/billing",
    icon: DollarSign,
    roles: [UserRole.ADMIN, UserRole.FINANCE, UserRole.RECEPTIONIST]
  },
  {
    name: "Staff",
    href: "/staff",
    icon: UserCheck,
    roles: [UserRole.ADMIN]
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    roles: [UserRole.ADMIN, UserRole.PHARMACIST]
  },
  {
    name: "Research",
    href: "/research",
    icon: GraduationCap,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RESEARCHER]
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-sidebar">
          <SidebarContent onNavigate={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:w-64 lg:flex lg:flex-col">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header className="bg-white border-b border-border px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">KUTRRH</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ProtectedComponent permissions={["patients.write"]}>
                <Button size="sm" className="gap-2" asChild>
                  <Link to="/patients">
                    <Plus className="h-4 w-4" />
                    New Patient
                  </Link>
                </Button>
              </ProtectedComponent>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium">
                        {user?.staff ? `${user.staff.firstName} ${user.staff.lastName}` : user?.email}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user?.staff?.position || user?.role}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {user?.staff ? `${user.staff.firstName} ${user.staff.lastName}` : 'User'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {user?.role}
                        </Badge>
                        {user?.staffId && (
                          <span className="text-xs text-muted-foreground">
                            ID: {user.staffId}
                          </span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">KUTRRH</h1>
            <p className="text-xs text-sidebar-foreground/70">Hospital Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation
          .filter(item => !item.roles || hasRole(item.roles))
          .map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/50">
          <p>Kenyatta University Teaching,</p>
          <p>Referral and Research Hospital</p>
          <p className="mt-2">© 2024 KUTRRH HMS</p>
        </div>
      </div>
    </div>
  );
}
