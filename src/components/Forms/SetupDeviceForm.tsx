import { useState } from "react";
import Swal from "sweetalert2";
import { useDeviceStore } from "../../stores/devices/device.store";
import Loader from "../../common/Loader";
import { FaCalculator } from "react-icons/fa";

export const SetupDeviceForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  //   Establecimiento
  const [url, setUrl] = useState<string>();
  const [mid, setMid] = useState<string>();
  const [tid, setTid] = useState<string>();
  const [textMode, setTextMode] = useState<string>();
  const [entityId, setEntityId] = useState<string>();
  const [Authorization, setAuthorization] = useState<string>();
  const [currency, setCurrency] = useState<string>();
  const [notificationUrl, setNotificationUrl] = useState<string>()
const setDevice = useDeviceStore((state) => state.setDevice);

  const handleSaveParam = async () => {
    setIsLoading(true);
    if (!url && !mid && !tid && !textMode && !entityId && !Authorization && !currency && !notificationUrl) {
      Swal.fire("Error", "Por favor ingrese los datos faltantes", "warning");
    }
    try {
      await setDevice({ url, mid, tid, textMode, entityId, Authorization, currency, notificationUrl });
    } catch (error) {
      Swal.fire("Error", `${error}`, "error");
    }
    setIsLoading(false);
    window.location.reload();
  };
  return <>
  {isLoading ? (
          <Loader />
        ) : (
          <div className="w-full ">
            <h2 className="text-2xl font-medium text-black dark:text-white mb-7">
            <div className="flex flex-row justify-center"><FaCalculator className="mr-2"/> Configuración de Dispositivo DataFast </div>
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveParam();
              }}
            >
              <div className="mb-4 flex flex-row justify-between">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Url
                </label>
                <div className="relative">
                  <input
                    name="url}"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    type="text"
                    placeholder="Ingrese url "
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-row justify-between">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  MID
                </label>
                <div className="relative">
                  <input
                    name="mid"
                    value={mid}
                    type="text"
                    onChange={(e) => setMid(e.target.value)}
                    placeholder="Ingrese valor de MID"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-row justify-between">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  TID
                </label>
                <div className="relative">
                  <input
                    name="tid"
                    value={tid}
                    type="text"
                    onChange={(e) => setTid(e.target.value)}
                    placeholder="Ingrese valor de TID"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-row justify-between">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  TextMode
                </label>
                <div className="relative">
                  <input
                    name="textMode"
                    value={textMode}
                    type="text"
                    onChange={(e) => setTextMode(e.target.value)}
                    placeholder="Ingrese valor de textMode"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-row justify-between">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  EntityId
                </label>
                <div className="relative">
                  <input
                    name="entityId"
                    value={entityId}
                    type="text"
                    onChange={(e) => setEntityId(e.target.value)}
                    placeholder="Ingrese valor de EntityId"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-row justify-between">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Authorization
                </label>
                <div className="relative">
                  <input
                    name="Authorization"
                    value={Authorization}
                    type="text"
                    onChange={(e) => setAuthorization(e.target.value)}
                    placeholder="Ingrese valor de authorization"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-row justify-between">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Moneda
                </label>
                <div className="relative">
                  <input
                    name="currency"
                    value={currency}
                    type="text"
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="Ingrese valor de currency"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-row justify-between">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Url de Notificación
                </label>
                <div className="relative">
                  <input
                    name="notificationUrl"
                    value={notificationUrl}
                    type="text"
                    onChange={(e) => setNotificationUrl(e.target.value)}
                    placeholder="Ingrese valor de notificationUrl"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-5">
                <input
                //   onClick={handleSaveParam}
                  type="submit"
                  value="Guardar"
                  className="block w-full border-separate rounded border bg-inherit p-3 text-center font-medium text-graydark transition hover:border-meta-3 hover:bg-meta-3 hover:bg-opacity-90 hover:text-white"
                />
              </div>
            </form>
          </div>
        )}</>;
};
