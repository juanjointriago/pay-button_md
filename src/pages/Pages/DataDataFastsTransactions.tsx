import { useMemo, useEffect, useState } from "react"
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric"
import { TableColumn } from "react-data-table-component";
import { IDatafastTransaction } from "../../interfaces/datafast-transaction.interface";
import Swal from "sweetalert2";
import { to } from "../../utils/to";
import { AxiosResponse } from "axios";
import API from "../api/api";
import { ScreenLoader } from "../../components/shared/ScreenLoader";
import { FaSearch } from "react-icons/fa";
import { MdOutlineCleaningServices } from "react-icons/md";

export const DataDataFastsTransactions = () => {
  const [data, setData] = useState([]);
  const [filterBy, setFilterBy] = useState('debt.titleName');
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [filterValue, setFilterValue] = useState('');

  const columns: TableColumn<IDatafastTransaction>[] = useMemo(() => ([
    // {
    //   id: 'actions',
    //   name: 'Acciones',
    //   button: true,
    //   style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left", width: "200px" },
    //   center: false,
    //   cell(row) {
    //     return (
    //       <div className="flex flex-1 min-w-[200px] mx-auto">
    //         <button
    //           className="rounded px-4 py-2 font-bold text-rose-800 hover:bg-rose-700/15 flex mx-auto"
    //           onClick={() => {
    //             //TODO: AQUI VA LA LOGICA DEL PDF
    //           }}
    //         >Ver PDF</button>
    //       </div>
    //     );
    //   },
    // },
    {
      id: "debt.titleName",
      name: "Nombre de la deuda",
      selector: (row) => row.debt.titleName,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "250px",
    },
    {
      id: "state",
      name: "Estado",
      selector: (row) => row.state,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      id: "debt.discount",
      name: "Descuento",
      selector: (row) => row.debt.discount,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "120px",
    },
    {
      id: "debt.totalAmount",
      name: "Total",
      selector: (row) => row.debt.totalAmount,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    // {
    //   id: "interest",
    //   name: "Interés",
    //   selector: (row) => row.interest,
    //   sortable: true,
    //   style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
    //   width: "100px",
    // },

    // {
    //   id: "createdAt",
    //   name: "Fecha de Registro",
    //   selector: (row) => row.createdAt as any,
    //   sortable: true,
    //   style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
    //   width: "250px",
    // },
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
  ]), []);

  useEffect(() => {
    handleSearch();
  }, []);


  const handleSearch = async () => {
    setIsLoadingSearch(true);
    // if (auth.profileId === 1) {
    // const dataQuery: any = Object.keys(formValues).reduce((acc, key) => {
    //   if (formValues[key]) {
    //     acc[key] = formValues[key];
    //   }
    //   return acc;
    // }, {});

    // const { actionLiquidationType, ...rest } = dataQuery;

    // const params = new URLSearchParams(dataQuery);
    // const url = `/transaction?${params.toString()}`;
    const url = `/transaction`;

    const [error, response] = await to<AxiosResponse<any>>(API.get(url));
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error", // 'Oops...',
        text: "Error al tratar de consultar", // 'Debes seleccionar una sola fila',
        confirmButtonColor: "blue",
      });
    } else {
      setData(response.data.data);
    }
    setIsLoadingSearch(false);
  }

  return (
    <>
      <ScreenLoader isLoading={isLoadingSearch} />

      <div className="bg-white rounded-md p-8">

        <h1 className="font-semibold text-2xl text-center">Transacciones Realizadas</h1>

        <div>
          <label className="text-gray-900 block text-sm font-medium dark:text-white whitespace-nowrap items-center">
            Filtrar por:
          </label>

          <form className="flex"
            onSubmit={async (e) => {
              e.preventDefault();

              if (!filterBy || filterValue.trim() === '') return;
              await handleSearch();
              // await new Promise(resolve => setTimeout(resolve, 500));

              let keyValue = filterBy;
              let keySubvalue = null;
              if (filterBy.includes('.')) {
                const key = filterBy.split('.')[0];
                const subvalue = filterBy.split('.')[1];
                keyValue = key;
                keySubvalue = subvalue;
              }

              setData(data => data.filter(row => {
                if (keySubvalue) {
                  return row[keyValue][keySubvalue].toString().toLowerCase().includes(filterValue.toLowerCase());
                }
                return row[keyValue].toString().toLowerCase().includes(filterValue.toLowerCase());
              }));
            }}
          >
            <select
              id="type"
              className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-1/5 rounded-lg rounded-r-none border border-r-0 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
              value={filterBy}
              onChange={(e: any) => {
                const value = e.target.value;
                setFilterBy(value);
                setFilterValue('');
              }}
            >
              {
                columns.map(column => (
                  <option key={column.id} value={column.id}>
                    {column.name}
                  </option>
                ))
              }
            </select>

            <input
              className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg rounded-l-none border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder={`Buscar por ${columns.find(c => c.id === filterBy)?.name}`}
              value={filterValue}
              onChange={(e: any) => {
                const value = e.target.value;
                setFilterValue(value);
              }}
            />

            <button
              type="submit"
              className="rounded-md bg-primary px-3 py-2 font-medium text-white hover:bg-opacity-90 flex items-center gap-2 ml-4"
            >
              Buscar <FaSearch />
            </button>

            <button
              type="button"
              className="rounded-md bg-primary px-3 py-2 font-medium text-white hover:bg-opacity-90 flex items-center gap-2 ml-4"
              onClick={handleSearch}
            >
              Limpiar <MdOutlineCleaningServices />
            </button>
          </form>
        </div>


        <DataTableGeneric
          data={data}
          columns={columns}
          // selectableRows
          viewDetails
          // viewAction={setSelectedDebtById}
          // viewForm={<ViewDebtForm />}
          // filterField={auth.profileId === 2 ? null : filterBy}
          // filterField={filterBy}
          viewTitle="Realizar Pago"
          searchTitle={`Buscar por Código Catastral:`}
          // fieldPlaceHolder="Ej. 1.4.9.9.3.3.3."
          onSearch={handleSearch}
        // title={'Transacciones Datafast'}
        />
      </div>
    </>
  )
}
