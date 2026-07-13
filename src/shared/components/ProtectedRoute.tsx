import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/app/hook";

export const ProtectedRoute = () => {
  const { user, isLoading, isGuest, isAuthenticated } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>;
  }

  if (!user?.email && !isGuest && !isAuthenticated) {
    console.warn("-> Route is REDIRECTING to /login because no user/guest/auth found!");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
