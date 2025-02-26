import { isAuthorized } from "../../utils/authorization"
import ECommerce from "../Dashboard/ECommerce"
import { useAuthStore } from "../../stores/auth/auth.store"
import { Navigate } from "react-router-dom";

export const DataDashboard = () => {
  const user = useAuthStore(state => state.user);

  if (!isAuthorized(user, { entity: "STADISTICS", role: "ALLOW_READ" })) return <Navigate to="/home/debt" />;

  return (
    <ECommerce />
  )
}
