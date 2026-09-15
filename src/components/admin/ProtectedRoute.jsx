import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../ui/Loader";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullScreen />;
  if (!admin)
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
}
