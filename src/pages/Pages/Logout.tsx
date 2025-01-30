import { useEffect } from "react";
import { useAuthStore } from "../../stores/auth/auth.store";



export const Logout = () => {
  const logout = useAuthStore(state => state.logoutUser);

  useEffect(() => {
    logout();
  }, []);

  return (
    <> 
    </>
  )
};
