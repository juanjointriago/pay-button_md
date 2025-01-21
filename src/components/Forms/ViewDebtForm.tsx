import { useEffect, useState } from "react";
import { useDebts } from "../../stores/debts/dbts.store";
import Loader from "../../common/Loader";

export const ViewDebtForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const selectedDebt = useDebts((state) => state.selectedDebt);

  useEffect(() => {
    setIsLoading(true)
    setIsLoading(false)

  }, [selectedDebt]);

  const handlePay = async (e) => {
    e.preventDefault();
    console.log('papyingg....');
  }


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full">
          <form>
            <div className="mb-1 flex flex-row justify-between">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Codigo Local
              </label>
              <div className="relative">
                <label className="mb-1 block font-medium text-black dark:text-white">
                  {selectedDebt.localCode}
                </label>
              </div>
            </div>
            <div className="mb-1 flex flex-row justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Propietario
              </label>
              <div className="relative">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {selectedDebt.shopperName == "" ? "-----" : selectedDebt.shopperName}
                </label>
              </div>
            </div>
            <div className="mb-2 flex flex-row justify-between">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Valor
              </label>
              <div className="relative">
                <label className="mb-1 block font-medium text-black dark:text-white">
                  {selectedDebt.totalAmount ?? 0}
                </label>
              </div>
            </div>
            <div className="mb-1 flex flex-row justify-between">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Interes
              </label>
              <div className="relative">
                <label className="mb-1 block font-medium text-black dark:text-white">
                  {selectedDebt.interest ?? 0}
                </label>
              </div>
            </div>
            <div className="mb-1 flex flex-row justify-between">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Tipo de liquidacion
              </label>
              <div className="relative">
                <label className="mb-1 block font-medium text-black dark:text-white">
                  {selectedDebt.actionLiquidationType}
                </label>
              </div>
            </div>
            <div className="mb-1 flex flex-row justify-between">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Forma de Pago:
              </label>
              <div className="relative">
                <select
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="Efectivo">Tarjeta de Crédito/Débito</option>
                </select>
              </div>
            </div>
            {/* <div className="m1 flex flex-row justify-between">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Fecha Max. pago
              </label>
              <div className="relative">
                <label className="mb-1 block font-medium text-black dark:text-white">
                  {selectedDebt.debtDate.toString() }
                </label>
              </div>
            </div> */}

            <div className="mb-5">
              <input
                onClick={handlePay}
                type="submit"
                value="Realizar Pago"
                className="block w-full border-separate rounded border bg-inherit p-3 text-center font-medium text-graydark transition hover:border-meta-3 hover:bg-meta-3 hover:bg-opacity-90 hover:text-white"
              />
            </div>

          </form>
        </div>
      )}
    </>
  )
}
