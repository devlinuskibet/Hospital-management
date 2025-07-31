import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permissions?: string[];
}

export default function ProtectedRoute({
  children,
  roles,
  permissions,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check roles if specified
  if (roles && !hasRole(roles)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Check permissions if specified
  if (permissions) {
    const hasRequiredPermissions = permissions.every((permission) =>
      hasPermission(permission),
    );

    if (!hasRequiredPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">
              Insufficient Permissions
            </h1>
            <p className="text-muted-foreground">
              You don't have the required permissions to access this page.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
