import { useState } from "react";
import { useAuthStore } from "../../stores/auth/auth.store";
import { TableColumn } from "react-data-table-component";
import { IDonePayment } from "../../interfaces/transactions.interface";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { ScreenLoader } from "../../components/shared/ScreenLoader";
import API from "../api/api";
import { to } from "../../utils/to";
import { AxiosResponse } from "axios";
import Swal from "sweetalert2";

export enum SelectorKeys {
  'CONSULTA DEUDA PREDIAL URBANO Y RUSTICOS' = '1',
  'CONSULTA DEUDA PERMISO DE FUNCIONAMIENTO' = '2',
  'CONSULTA DEUDA POR EL CODIGO DE LA LIQUIDACION' = '3'
}

export const selectOptions = [
  {
    id: '1',
    name: 'CONSULTA DEUDA PREDIAL URBANO Y RUSTICOS',
  },
  {
    id: '2',
    name: 'CONSULTA DEUDA PERMISO DE FUNCIONAMIENTO',
  },
  {
    id: '3',
    name: 'CONSULTA DEUDA POR EL CODIGO DE LA LIQUIDACION',
  }
]

export const DataTransactions = () => {
  // const users = useUserStore((state) => state.users);
  const [debts, setDebts] = useState([]);
  // const debts = useDebts((state) => state.debts);
  // const setSelectedDebtById = useDebts((state) => state.setSelectedDebtById);
  const auth = useAuthStore((state) => state.user);
  // const [filteredData, setFilteredData] = useState(auth.profileId === 2 ? debts.filter((debt) => debt.customerId === auth.id).filter((debt) => debt.actionLiquidationType === 1) : debts);

  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  // const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // const [filterBy, setFilterBy] = useState('localCode');
  const [filterBy, setFilterBy] = useState(SelectorKeys["CONSULTA DEUDA PREDIAL URBANO Y RUSTICOS"]);

  const columns: TableColumn<IDonePayment>[] = [
    {
      id: 'actions',
      name: 'Acciones',
      button: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left", width: "200px" },
      center: false,
      cell() {
        return (
          <div className="flex flex-1 min-w-[200px] mx-auto">
            <button
              className="rounded px-4 py-2 font-bold text-rose-800 hover:bg-rose-700/15 flex mx-auto"
              onClick={() => {
                //TODO: AQUI VA LA LOGICA DEL PDF
              }}
            >Ver PDF</button>
          </div>
        );
      },
    },
    {
      id: "transaction.type",
      name: "Tipo de Transacción",
      selector: (row) => row.transaction.type,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    },

    {
      id: "debt.year",
      name: "Año de la deuda",
      selector: (row) => row.debt.year,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "80px",
    },
    {
      id: "debt.titleName",
      name: "Nombre de la deuda",
      selector: (row) => row.debt.titleName,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    },
    {
      id: "observation",
      name: "Observaciones",
      selector: (row) => row.observation,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      id: "receiptNumber",
      name: "Recibo Nro.",
      selector: (row) => row.receiptNumber,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      id: "amount",
      name: "Monto",
      selector: (row) => row.amount,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      id: "cardNumber",
      name: "Tarjeta",
      selector: (row) => row.cardNumber,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "170px",
    },
    {
      id: "cardHolderName",
      name: "Propietario",
      selector: (row) => row.cardHolderName,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "140px",
    },
    {
      id: "state",
      name: "Estado",
      selector: (row) => row.transaction.state,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },

    {
      id: "transaction.executionDate",
      name: "Fecha de Ejecución",
      selector: (row) => row.transaction.executionDate as any,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "250px",
    },
    // {
    //   id: 'payment',
    //   name: 'Acciones',
    //   button: true,
    //   style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left", width: "200px" },
    //   center: true,
    //   cell(row) {
    //     return (
    //       <div className="flex flex-1 min-w-[200px] mx-auto">
    //         <button
    //           className="rounded px-4 py-2 font-bold text-blue-950 hover:bg-blue-700/15 flex mx-auto"
    //           // onClick={() => onStartPayment(generateCheckoutId)}
    //           onClick={() => {
    //             setSelectedDebtById(row.id);
    //             setDetailsModalOpen(true);
    //             // console.log("✏️ view =>", selectedRows[0]);
    //             // viewAction(selectedRows[0].id);
    //             // console.log("view", selectedRows);
    //           }}
    //         >Realizar Pago</button>
    //       </div>
    //     );
    //   },
    // }
  ];

  const handleSearch = async (formValues) => {
    setIsLoadingSearch(true);
    // if (auth.profileId === 1) {
      const dataQuery: any = Object.keys(formValues).reduce((acc, key) => {
        if (formValues[key]) {
          acc[key] = formValues[key];
        }
        return acc;
      }, {});

      // const { actionLiquidationType, ...rest } = dataQuery;

      const params = new URLSearchParams(dataQuery);
      const url = `/payment?${params.toString()}`;

      const [error, response] = await to<AxiosResponse<any>>(API.get(url));
      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error", // 'Oops...',
          text: "Error al tratar de consultar", // 'Debes seleccionar una sola fila',
          confirmButtonColor: "blue",
        });
      } else {
        setDebts(response.data.data);
        // setDebts(response.data.data.map(item => ({
        //   ...item,
        //   ...item.debt,
        //   ...item.payment
        // })));
      }
    // } else {
    //   // const searchValue = formValues['codigoCatastral'];

    //   // TODO: CALL API SERVICE FOR CLIENT
    // }
    setIsLoadingSearch(false);
  }

  return (
    <>
      <ScreenLoader isLoading={isLoadingSearch} />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {auth.profileId !== 2 && <div className="flex flex-row gap-5 items-center">
          <label className="text-gray-900 block text-sm font-medium dark:text-white whitespace-nowrap items-center">
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

            {/* {
              columns.map(column => (
                <option key={column.id} value={column.id as string}>
                  {column.name}
                </option>
              ))
            } */}

            {
              selectOptions.map(column => (
                <option key={column.id} value={column.id}>
                  {column.name}
                </option>
              ))
            }
          </select>

          {/* <label className="text-gray-900 mb-2 block text-sm font-medium dark:text-white">
              Filtrar por Fecha
            </label> */}
          {/* <DatePickerOne/> */}
          {/* <button
            onClick={() => {
              console.log("Limpiando Registros");
              setFilteredData(debts)
            }}
            className="rounded bg-blue-950 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <FaTrash />
          </button> */}
        </div>}

        <DataTableGeneric
          data={debts}
          columns={columns}
          // selectableRows
          viewDetails
          // viewAction={setSelectedDebtById}
          // viewForm={<ViewDebtForm />}
          // filterField={auth.profileId === 2 ? null : filterBy}
          filterField={filterBy}
          viewTitle="Realizar Pago"
          searchTitle={`Buscar por Código Catastral:`}
          fieldPlaceHolder="Ej. 1.4.9.9.3.3.3."
          onSearch={handleSearch}
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
