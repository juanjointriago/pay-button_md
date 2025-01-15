import { FC, useEffect, useState } from "react";
import { useLogsStore } from "../../stores/logs/log.store";
import Loader from "../../common/Loader";
import "./styles.css";


export const DMLViewForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const selectedLog = useLogsStore((state) => state.selectedLog);
  // console.log("✅ selectedLog", selectedLog);

  useEffect(() => {
    setIsLoading(true)
    setIsLoading(false)

  }, [selectedLog]);

  const parseLongMessage = (message: string) => {
    // console.log('Message',{message})
    if(!message) return {old_record: {}, new_record: {}}
    const parsedMessage = JSON.parse(message);
    console.log("parsed Text", parsedMessage)
    return parsedMessage;
  };

  // console.log(parseLongMessage(selectedLog.long_msg).new_record);


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full">
          <form>
            {/* <div className="mb-2 flex flex-row justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                ID
              </label>
              <div className="relative">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {selectedLog.id}
                </label>
              </div>
            </div> */}
            <div className="mb-1 flex flex-row justify-between">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Entidad Afectada
              </label>
              <div className="relative">
                <label className="mb-1 block font-medium text-black dark:text-white">
                  {selectedLog.entity}
                </label>
              </div>
            </div>
            <div className="mb-1 flex flex-row justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Usuario
              </label>
              <div className="relative">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {selectedLog.user == "" ? "-----" : selectedLog.user}
                </label>
              </div>
            </div>
            <div className="mb-2 flex flex-row justify-between">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Programa
              </label>
              <div className="relative">
                <label className="mb-1 block font-medium text-black dark:text-white">
                  {selectedLog.program == "" ? "-----" : selectedLog.program}
                </label>
              </div>
            </div>
            <div className="mb-1 flex flex-row justify-between">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Mensaje
              </label>
              <div className="relative">
                <label className="mb-1 block font-medium text-black dark:text-white">
                  {selectedLog.short_msg == ""
                    ? "-----"
                    : selectedLog.short_msg}
                </label>
              </div>
            </div>
            <div className="mb-1 flex flex-row justify-between">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Tipo
              </label>
              <div className="relative">
                <label className="mb-1 block font-medium text-black dark:text-white">
                  {selectedLog.type == "" ? "-----" : selectedLog.type}
                </label>
              </div>
            </div>
            <div className="m1 flex flex-row justify-between">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Versión
              </label>
              <div className="relative">
                <label className="mb-1 block font-medium text-black dark:text-white">
                  {selectedLog.version == "" ? "-----" : selectedLog.version}
                </label>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Datos Modificados :
              </label>
            </div>{!!(selectedLog.long_msg) &&
              <div className="relative w-auto overflow-x-scroll ">
                <pre className="block w-auto rounded-lg border border-gray-300 bg-gray-50 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" >
                Registro Previo:{JSON.stringify(parseLongMessage(selectedLog.long_msg).old_record, null, 2)}
                </pre>
                <pre className="block w-auto rounded-lg border border-gray-300 bg-gray-50 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" >
                  Reemplazado por:{JSON.stringify(parseLongMessage(selectedLog.long_msg).new_record, null, 2)}
                </pre>
              </div>}
          </form>
        </div>
      )}
    </>
  );
};
