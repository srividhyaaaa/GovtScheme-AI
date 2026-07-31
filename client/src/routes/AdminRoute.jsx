import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && isAdmin) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
}

export default AdminRoute;
