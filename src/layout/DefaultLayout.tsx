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
import { useEntitiesStore } from "../stores/entities/entities.store";

export const DefaultLayout: FC = () => {
  const authStatus = useAuthStore((state) => state.status);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const logoutUser = useAuthStore((state) => state.logoutUser);

  useEffect(() => {
    authorizeCheck();
  }, []);

  const authorizeCheck = async () => {
    console.log("🔐AUTH STATUS", authStatus);
    await checkAuthStatus();
    if (authStatus === "unauthorized") {
      await logoutUser();
      return <Navigate to="/auth/signin" />;
    }
  };

  const getAllUsers = useUserStore((state) => state.getUsers);
  const getAllProfiles = useProfileStore((state) => state.getProfiles);
  const getAllRoles = useRoleStore((state) => state.getRoles);
  const getAllParams = useParamStore((state) => state.getAndSetParams);
  const getAllDebts = useDebts((state) => state.getAndSetDebts);
  const getAllEntities = useEntitiesStore((state) => state.getAndSetEntities);

  //get and set all tables data
  useEffect(() => {
    getAllDebts();
    getAllUsers();
    getAllProfiles();
    getAllRoles();
    getAllParams();
    getAllEntities();
  }, [getAllUsers, getAllProfiles, getAllRoles, getAllParams, getAllDebts, getAllEntities]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
