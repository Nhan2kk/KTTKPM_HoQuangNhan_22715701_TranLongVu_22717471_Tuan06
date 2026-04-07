import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    return <Navigate to="/login" />;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role !== "ADMIN") {
      return <Navigate to="/dashboard" />;
    }
    return <>{children}</>;
  } catch (error) {
    return <Navigate to="/login" />;
  }
};
