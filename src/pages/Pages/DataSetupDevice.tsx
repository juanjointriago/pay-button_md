import { SetupDeviceForm } from "../../components/Forms/SetupDeviceForm"
import { NoAuthorized } from "../../components/shared/NoAuthorized";
import { useAuthStore } from "../../stores/auth/auth.store";
import { isAuthorized } from "../../utils/authorization";

export const DataSetupDevice = () => {
  const user = useAuthStore(state => state.user);

  if (!isAuthorized(user, { entity: "DATAFAST", role: "ALLOW_READ" })) return <NoAuthorized />;

  return (
    <><SetupDeviceForm/></>
  )
}
