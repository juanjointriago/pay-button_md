import { FC, useState } from "react";
import Swal from "sweetalert2";
import { useParamStore } from "../../stores/params/params.store";
import Loader from "../../common/Loader";

export const AddParamForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const addParam = useParamStore((state) => state.addParam);

  const handleSaveParam = async () => {
    setIsLoading(true);
    if (!key && !value) {
      Swal.fire("Error", "Por favor ingrese los datos faltantes", "warning");
    }
    try {
      await addParam({ key, value });
    } catch (error) {
      Swal.fire("Error", `${error}`, "error");
    }
    setIsLoading(false);
    window.location.reload();
  };
  return (
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="w-full ">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveParam();
              }}
            >
              <div className="mb-4 flex flex-row justify-between">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Key
                </label>
                <div className="relative">
                  <input
                    name="key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    type="text"
                    placeholder="Ingrese clave o key "
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-row justify-between">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Valor
                </label>
                <div className="relative">
                  <input
                    name="value"
                    value={value}
                    type="text"
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Ingrese valor de key"
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
        )}
      </>
  );
};
