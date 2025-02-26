import { Navigate, Outlet } from "react-router-dom";
import { Suspense, useEffect } from "react";
import Loader from "../common/Loader";
import { useAuthStore } from "../stores/auth/auth.store";

export const AuthLayout = () => {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const authStatus = useAuthStore((state) => state.status);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if(authStatus === 'checking') return <Loader />;
  

  if (authStatus === "authorized") {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-gray-100 flex h-screen items-center justify-center">
        <Suspense fallback={<Loader />}>
      <div className="sm:20 w-full p-8 md:p-20">
        <Outlet />
      </div>
        </Suspense>
    </div>
  );
};
