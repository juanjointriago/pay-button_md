import { useState } from "react";
import { useAuthStore } from "../../stores/auth/auth.store";
import { useDebts } from "../../stores/debts/dbts.store";
import { useUserStore } from "../../stores/users/users.store";
import { TableColumn } from "react-data-table-component";
import { TransactionInterface } from "../../interfaces/transactions.interface";
import { FaTrash } from "react-icons/fa";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { ViewDebtForm } from "../../components/Forms/ViewDebtForm";

export const DataTransactions = () => {
  // const users = useUserStore((state) => state.users);
  const debts = useDebts((state) => state.debts);
  const setSelectedDebtById = useDebts((state) => state.setSelectedDebtById);
  const auth = useAuthStore((state) => state.user);
  const [filteredData, setFilteredData] = useState(auth.profileId === 2 ? debts.filter((debt) => debt.customerId === auth.id).filter((debt) => debt.actionLiquidationType === 1) : debts);

  const [filterBy, setFilterBy] = useState('localCode');

  const columns: TableColumn<TransactionInterface>[] = [
    {
      id: "localCode",
      name: "Código Local",
      selector: (row) => row.localCode,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    },

    {
      id: "totalAmount",
      name: "Total",
      selector: (row) => row.totalAmount,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      id: "discount",
      name: "Dsto",
      selector: (row) => row.discount,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      id: "interest",
      name: "Interés",
      selector: (row) => row.interest,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },

    {
      id: "createdAt",
      name: "Fecha de Registro",
      selector: (row) => row.createdAt as any,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    },
  ];


  return (
    <>
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {auth.profileId !== 2 && <div className="flex flex-row gap-5">
          <label className="text-gray-900 mb-2 block text-sm font-medium dark:text-white">
            Filtrar por Usuario
          </label>
          <select
            id="type"
            className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={filterBy}
            onChange={(e: any) => {
              // console.log("setFilteredData", e.target.value);
              const value = e.target.value;
              setFilterBy(value);
              // console.log({value});
              
              // const userFilteredData = debts.filter((debt) => debt.customerId === Number(e.target.value.trim()))
              // console.log("userFilteredData", userFilteredData.length);
              // setFilteredData(userFilteredData);
            }}
          >
            {/* {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))} */}

            {
              columns.map(column => (
                <option key={column.id} value={column.id as string}>
                  {column.name}
                </option>
              ))
            }
          </select>

          {/* <label className="text-gray-900 mb-2 block text-sm font-medium dark:text-white">
              Filtrar por Fecha
            </label> */}
          {/* <DatePickerOne/> */}
          <button
            onClick={() => {
              console.log("Limpiando Registros");
              setFilteredData(debts)
            }}
            className="rounded bg-blue-950 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <FaTrash />
          </button>
        </div>}

        <DataTableGeneric
          data={filteredData}
          columns={columns}
          selectableRows
          viewDetails
          viewAction={setSelectedDebtById}
          viewForm={<ViewDebtForm />}
          filterField={auth.profileId === 2 ? null : filterBy}
          viewTitle="Realizar Pago"
          searchTitle={`Buscar por ${filterBy}`}
          fieldPlaceHolder="Ej. 1.4.9.9.3.3.3."
          title={
            auth.profileId !== 2 ? <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <div>Impuestos por cobrar</div>
            </div> : 'Pagos realizados'
          }
        />
      </div>
    </>
  )
}
