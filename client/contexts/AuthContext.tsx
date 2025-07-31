import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  staffId?: string;
  staff?: {
    id: string;
    firstName: string;
    lastName: string;
    department: string;
    position: string;
    specialization?: string;
  };
}

export enum UserRole {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  RECEPTIONIST = "RECEPTIONIST",
  PHARMACIST = "PHARMACIST",
  LAB_TECH = "LAB_TECH",
  RADIOLOGIST = "RADIOLOGIST",
  FINANCE = "FINANCE",
  RESEARCHER = "RESEARCHER",
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.auth.profile();
      setUser(response.user);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("auth_token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });

      localStorage.setItem("auth_token", response.token);
      setUser(response.user);

      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    toast.info("Logged out successfully");
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Define role-based permissions
    const permissions: Record<UserRole, string[]> = {
      [UserRole.ADMIN]: ["*"], // Admin has all permissions
      [UserRole.DOCTOR]: [
        "patients.read",
        "patients.write",
        "appointments.read",
        "appointments.write",
        "prescriptions.write",
        "lab.request",
        "radiology.request",
        "dashboard.read",
      ],
      [UserRole.NURSE]: [
        "patients.read",
        "patients.write",
        "appointments.read",
        "appointments.write",
        "dashboard.read",
      ],
      [UserRole.RECEPTIONIST]: [
        "patients.read",
        "patients.write",
        "appointments.read",
        "appointments.write",
        "billing.read",
        "dashboard.read",
      ],
      [UserRole.PHARMACIST]: [
        "patients.read",
        "prescriptions.read",
        "prescriptions.dispense",
        "pharmacy.manage",
        "dashboard.read",
      ],
      [UserRole.LAB_TECH]: [
        "patients.read",
        "lab.read",
        "lab.write",
        "lab.results",
        "dashboard.read",
      ],
      [UserRole.RADIOLOGIST]: [
        "patients.read",
        "radiology.read",
        "radiology.write",
        "radiology.report",
        "dashboard.read",
      ],
      [UserRole.FINANCE]: [
        "patients.read",
        "billing.read",
        "billing.write",
        "reports.financial",
        "dashboard.read",
      ],
      [UserRole.RESEARCHER]: [
        "patients.read",
        "research.read",
        "research.write",
        "reports.research",
        "dashboard.read",
      ],
    };

    const userPermissions = permissions[user.role] || [];

    // Admin has all permissions
    if (userPermissions.includes("*")) return true;

    return userPermissions.includes(permission);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Role-based component wrapper
interface ProtectedComponentProps {
  children: ReactNode;
  roles?: UserRole | UserRole[];
  permissions?: string | string[];
  fallback?: ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  roles,
  permissions,
  fallback = null,
}) => {
  const { hasRole, hasPermission } = useAuth();

  // Check roles
  if (roles && !hasRole(roles)) {
    return <>{fallback}</>;
  }

  // Check permissions
  if (permissions) {
    const permissionArray = Array.isArray(permissions)
      ? permissions
      : [permissions];
    const hasRequiredPermissions = permissionArray.every((permission) =>
      hasPermission(permission),
    );

    if (!hasRequiredPermissions) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};
