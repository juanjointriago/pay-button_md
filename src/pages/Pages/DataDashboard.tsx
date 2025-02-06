import { isAuthorized } from "../../utils/authorization"
import ECommerce from "../Dashboard/ECommerce"
import { useAuthStore } from "../../stores/auth/auth.store"
import { NoAuthorized } from "../../components/shared/NoAuthorized";

export const DataDashboard = () => {
  const user = useAuthStore(state => state.user);

  if (!isAuthorized(user, { entity: "STADISTICS", role: "ALLOW_READ" })) return <NoAuthorized />

  return (
    <ECommerce />
  )
}
