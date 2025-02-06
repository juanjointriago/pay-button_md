import { useEffect, useState } from "react";
import Loader from "../../common/Loader";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { to } from "../../utils/to";
import API from "../../pages/api/api";
import { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { useAuthStore } from "../../stores/auth/auth.store";
import { isAuthorized } from "../../utils/authorization";
import { NoAuthorized } from "../shared/NoAuthorized";

const businessSchema = z.object({
  request_entityId: z.string().trim().min(1, { message: 'Este campo no puede estar vacío' }),
  request_token: z.string().trim().min(1, { message: 'Este campo no puede estar vacío' }),
  request_mid: z.string().trim().min(1, { message: 'Este campo no puede estar vacío' }),
  request_tid: z.string().trim().min(1, { message: 'Este campo no puede estar vacío' }),
});

type Business = z.infer<typeof businessSchema>;

export const SetupDeviceForm = () => {
  const user = useAuthStore(state => state.user);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<Business>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      request_entityId: '',
      request_token: '',
      request_mid: '',
      request_tid: '',
    },
  });

  useEffect(() => {
    setIsLoading(true);
    to<AxiosResponse<any>>(API.get('params/request'))
      .then(([error, response]) => {
        if (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Error", // 'Oops...',
            text: "Error al tratar de cargar los parametros", // 'Debes seleccionar una sola fila',
            confirmButtonColor: "blue",
          });
          setIsLoading(false);
          return;
        }
        setData(response.data.data);
        setIsLoading(false);
      })
  }, []);


  useEffect(() => {
    if (!data) return;
    data.forEach((param) => {
      form.setValue(param.key, param.value);
    });
  }, [data]);

  //   Establecimiento
  // const [url, setUrl] = useState<string>();
  // const [mid, setMid] = useState<string>();
  // const [tid, setTid] = useState<string>();
  // const [textMode, setTextMode] = useState<string>();
  // const [entityId, setEntityId] = useState<string>();
  // const [Authorization, setAuthorization] = useState<string>();
  // const [currency, setCurrency] = useState<string>();
  // const [notificationUrl, setNotificationUrl] = useState<string>()
  // const setDevice = useDeviceStore((state) => state.setDevice);

  // const handleSaveParam = async () => {
  //   setIsLoading(true);
  //   if (!url && !mid && !tid && !textMode && !entityId && !Authorization && !currency && !notificationUrl) {
  //     Swal.fire("Error", "Por favor ingrese los datos faltantes", "warning");
  //   }
  //   try {
  //     await setDevice({ url, mid, tid, textMode, entityId, Authorization, currency, notificationUrl });
  //   } catch (error) {
  //     Swal.fire("Error", `${error}`, "error");
  //   }
  //   setIsLoading(false);
  //   window.location.reload();
  // };

  const onSubmit = async(formValues: Business) => {
    if (!isAuthorized(user, { entity: "DATAFAST", role: "ALLOW_UPDATE" })) return Swal.fire("Error", "No tienes permisos para realizar esta acción", "error");

    setIsLoading(true);
    const values = Object.keys(formValues).map((key) => {
      return {
        key,
        value: formValues[key]
      }
    });
    // const values = data.map((param) => {
    //   return {
    //     key: param.key,
    //     value: formValues[param.key]
    //   }
    // });    
    
    const [error] = await to<AxiosResponse<any>>(API.put('params/saveReqs', values));
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error", // 'Oops...',
        text: "Error al tratar de guardar los parametros", // 'Debes seleccionar una sola fila',
        confirmButtonColor: "blue",
      });
    }else {
      Swal.fire({
        icon: "success",
        title: "¡Datos guardados correctamente!", // 'Oops...',
        text: "Se enviaron los datos correctamente", // 'Debes seleccionar una sola fila',
        confirmButtonColor: "blue",
      });
    }
    setIsLoading(false);
  };

  return <>
    {isLoading ? (
      <Loader />
    ) : (
      <div className="w-full px-32 mx-auto">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <fieldset className="px-10 rounded-lg bg-white py-12 shadow-md border-black border-2 border-opacity-10">
            {/* <legend className="mx-auto px-4"> */}
              <h2 className="text-3xl font-semibold text-black dark:text-white mb-12">
                <div className="flex flex-row justify-center">Configurar datos del establecimiento</div>
              </h2>
            {/* </legend> */}

            <div className="grid grid-cols-2 gap-8 gap-x-16">
              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Id del establecimiento
                </label>
                <input
                  type="text"
                  className="w-full rounded border border-black bg-slate-100 p-3 text-black dark:border-strokedark border-1"
                  placeholder="Id del establecimiento"
                  {...form.register("request_entityId")}
                />
                {
                  form.formState.errors.request_entityId && form.formState.errors.request_entityId.message && (
                    <p className="text-rose-500 text-xs italic">
                      {form.formState.errors.request_entityId.message}
                    </p>
                  )
                }
              </div>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Autorización
                </label>
                <input
                  type="password"
                  className="w-full rounded border border-black bg-slate-100 p-3 text-black dark:border-strokedark border-1"
                  placeholder="Token de autorización"
                  {...form.register("request_token")}
                />
                {
                  form.formState.errors.request_token && form.formState.errors.request_token.message && (
                    <p className="text-rose-500 text-xs italic">
                      {form.formState.errors.request_token.message}
                    </p>
                  )
                }
              </div>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  MID
                </label>
                <input
                  type="text"
                  className="w-full rounded border border-black bg-slate-100 p-3 text-black dark:border-strokedark border-1"
                  placeholder="MID"
                  {...form.register("request_mid")}
                />
                {
                  form.formState.errors.request_mid && form.formState.errors.request_mid.message && (
                    <p className="text-rose-500 text-xs italic">
                      {form.formState.errors.request_mid.message}
                    </p>
                  )
                }
              </div>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  TID
                </label>
                <input
                  type="text"
                  className="w-full rounded border border-black bg-slate-100 p-3 text-black dark:border-strokedark border-1"
                  placeholder="TID"
                  {...form.register("request_tid")}
                />
                {
                  form.formState.errors.request_tid && form.formState.errors.request_tid.message && (
                    <p className="text-rose-500 text-xs italic">
                      {form.formState.errors.request_tid.message}
                    </p>
                  )
                }
              </div>

              <button
                type="submit"
                className="block w-full border-separate rounded border bg-inherit p-3 text-center font-medium text-graydark transition hover:border-meta-3 hover:bg-meta-3 hover:bg-opacity-90 hover:text-white col-span-2 max-w-[300px] mx-auto mt-2"
              >
                Guardar
              </button>
            </div>
          </fieldset>
          {/* <div className="mb-4 flex flex-row justify-between">
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
              </div> */}
        </form>
      </div>
    )}</>;
};
