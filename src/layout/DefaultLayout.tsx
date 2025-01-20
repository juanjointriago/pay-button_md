import { useState, FC, useEffect } from "react";
import Header from "../components/Header/index";
import Sidebar from "../components/Sidebar/index";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/auth/auth.store";
import { useUserStore } from "../stores/users/users.store";
import { useProfileStore } from "../stores/profile/profile.store";
import { useRoleStore } from "../stores/roles/roles.store";
import { useParamStore } from "../stores/params/params.store";
import { useDebts } from "../stores/debts/dbts.store";

export const DefaultLayout: FC = () => {
  const authStatus = useAuthStore((state) => state.status);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const logoutUser = useAuthStore((state) => state.logoutUser);

  useEffect(() => {
    authorizeCheck();
  }, []);

  const authorizeCheck = async () => {
    console.log("🔐AUTH STATUS", authStatus);
    checkAuthStatus();
    if (authStatus === "unauthorized") {
      logoutUser();
      return <Navigate to="/auth/signin" />;
    }
  };

  const getAllUsers = useUserStore((state) => state.getUsers);
  const getAllProfiles = useProfileStore((state) => state.getProfiles);
  const getAllRoles = useRoleStore((state) => state.getRoles);
  const getAllParams = useParamStore((state) => state.getAndSetParams);
  const getAllDebts = useDebts((state) => state.getAndSetDebts);

  //get and set all tables data
  useEffect(() => {
    getAllDebts();
    getAllUsers();
    getAllProfiles();
    getAllRoles();
    getAllParams();
  }, [getAllUsers, getAllProfiles, getAllRoles, getAllParams, getAllDebts]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};
