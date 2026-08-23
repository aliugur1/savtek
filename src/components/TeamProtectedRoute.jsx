import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function TeamProtectedRoute({ children }) {
  const { user, loading, demoRole } = useAuth();

  if (loading) return null;

  if (!user && demoRole !== "captain") {
    return <Navigate to="/" replace />;
  }

  return children;
}
