
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PublicOnlyRoute = () => {
  // Try-catch block to handle potential context errors
  try {
    const { user, loading } = useAuth();

    // Show loading state if authentication is being checked
    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Redirect to dashboard if already authenticated
    if (user) {
      return <Navigate to="/dashboard" replace />;
    }

    // Render child routes if not authenticated
    return <Outlet />;
  } catch (error) {
    console.error("Authentication error:", error);
    // Default to showing the login/register routes if there's an error
    return <Outlet />;
  }
};

export default PublicOnlyRoute;
