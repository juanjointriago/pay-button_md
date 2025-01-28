import { FC, useEffect, useState } from "react";
import { ParamInterface } from "../../interfaces/params.interface";
import { useParamStore } from "../../stores/params/params.store";
import Loader from "../../common/Loader";

interface Props {
  id?: number;
}
export const EditParamForm: FC<Props> = ({ id }) => {
  console.log("selectedParam", id);

  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [param, setParam] = useState<ParamInterface>({} as ParamInterface);
  const [infoMessage, setinfoMessage] = useState("");

  const editParam = useParamStore((state) => state.editParam);
  const selectedParam = useParamStore((state) => state.selectedParam);

  useEffect(() => {
    setParam(selectedParam);
    setKey(selectedParam.key);
    setValue(selectedParam.value);
    setinfoMessage(``);
  }, [id]);

  const handleEditParam = async () => {
    setIsLoading(true);
    await editParam(param.id, { key, value });
    setinfoMessage(`Parametro ${param.key} actualizado`);
    setIsLoading(false);
    window.location.reload();
  };

  console.log("selectedParam", param);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full ">
          {!infoMessage && <code>{param.key}</code>}
          {/* <code>{param.value}</code> */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditParam();
            }}
          >
            <div className="mb-4 flex flex-row justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Key
              </label>
              <div className="relative">
                <input
                  name="key"
                  value={selectedParam.key}
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
                  value={selectedParam.value}
                  type="text"
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Ingrese valor de key"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="mb-5">
              <input
                type="submit"
                value="Actualizar"
                className="block w-full border-separate rounded border bg-inherit p-3 text-center font-medium text-graydark transition hover:border-meta-3 hover:bg-meta-3 hover:bg-opacity-90 hover:text-white"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};
