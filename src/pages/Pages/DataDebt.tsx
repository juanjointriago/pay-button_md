import { useState } from "react";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
// import { useUserStore } from "../../stores/users/users.store";
import { useDebts } from "../../stores/debts/dbts.store";
import { TableColumn } from "react-data-table-component";
import { DebtInterface } from "../../interfaces/debt.interface";
import { ViewDebtForm } from "../../components/Forms/ViewDebtForm";
import { useAuthStore } from "../../stores/auth/auth.store";
import { selectOptions, SelectorKeys } from "./DataTransactions";
import Swal from "sweetalert2";
import { to } from "../../utils/to";
import { AxiosResponse } from "axios";
import API from "../api/api";
import { ScreenLoader } from "../../components/shared/ScreenLoader";

export const DataDebt = () => {
  // const users = useUserStore((state) => state.users);
  // const debts = useDebts((state) => state.debts);
  const setSelectedDebtById = useDebts((state) => state.setSelectedDebtById);
  const auth = useAuthStore((state) => state.user);

  // const [filterBy, setFilterBy] = useState('localCode');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [filterBy, setFilterBy] = useState(SelectorKeys["CONSULTA DEUDA PREDIAL URBANO Y RUSTICOS"]);
  const [debts, setDebts] = useState([]);
  // const useRef(null);
  const [filteredData, setFilteredData] = useState(auth.profileId === 2 ? debts.filter((debt) => debt.customerId === auth.id) : debts);

  const columns: TableColumn<DebtInterface>[] = [
    {
      id: 'actions',
      name: 'Acciones',
      button: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left", width: "200px" },
      center: false,
      cell(row) {
        return (
          <div className="flex flex-1 min-w-[200px] mx-auto">
            <button
              className="rounded px-4 py-2 font-bold text-blue-950 hover:bg-blue-700/15 flex mx-auto"
              onClick={() => {
                setSelectedDebtById(row.id);
                setDetailsModalOpen(true);
              }}
            >Realizar Pago</button>
          </div>
        );
      },
    },
    {
      id: "localCode",
      name: "Código Local",
      selector: (row) => row.localCode,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    },
    {
      id: "identification",
      name: "ID Cliente",
      selector: (row) => row.identification,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "120px",
    },
    {
      id: "titleName",
      name: "Detalle",
      selector: (row) => row.titleName,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "200px",
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
      id: 'year',
      name: "AÑO",
      selector: (row) => row.year,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      id: "liquidationCode",
      name: "Codigo Liq.",
      selector: (row) => row.liquidationCode,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "120px",
    },
    {
      id: "liquidationState",
      name: "Estado Liq.",
      selector: (row) => row.liquidationState,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "120px",
    },
    {
      id: 'actionLiquidationType',
      name: "Tipo Liquidación",
      selector: (row) => row.actionLiquidationType,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    },

    {
      id: 'plotId',
      name: "PLOT",
      selector: (row) => row.plotId,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      id: 'shopperName',
      name: "Propietario",
      selector: (row) => row.shopperName,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "200px",
    },
    {
      id: 'surcharge',
      name: "Sur Charge",
      selector: (row) => row.surcharge,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "120px",
    },

    {
      id: 'debtDate',
      name: "Fecha Max Pago",
      selector: (row) => row.debtDate as any,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    },
    {
      id: 'createdAt',
      name: "Fecha de Registro",
      selector: (row) => row.createdAt,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    }
  ];

  // useEffect(() => {
  //   var wpwlOptions = {
  //     onReady: function (onReady) {
  //       var datafast = '<br/><br/><img src=' + '"https://www.datafast.com.ec/images/verified.png" style=' + '"display:block;margin:0 auto; width:100%;">';
  //       $('form.wpwl-form-card').find('.wpwl-button').before(datafast);
  //     },
  //     style: "card",
  //     locale: "es",
  //     maskCvv: true,
  //     brandDetection: true,
  //     labels: {
  //       cvv: "CVV",
  //       cardHolder: "Nombre(Igual que en la tarjeta)"
  //     }
  //   }

  // }, []);

  const handleSearch = async (formValues) => {
    setIsLoadingSearch(true);
    if (auth.profileId === 1) {
      const dataQuery: any = Object.keys(formValues).reduce((acc, key) => {
        if (formValues[key]) {
          acc[key] = formValues[key];
        }
        return acc;
      }, {});

      // const { actionLiquidationType, ...rest } = dataQuery;

      const params = new URLSearchParams(dataQuery);
      const url = `/debt?${params.toString()}`;

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
      }
    } else {
      const searchValue = formValues['codigoCatastral'];

      // TODO: CALL API SERVICE FOR CLIENT
    }
    setIsLoadingSearch(false);
  }


  return (
    <>
      <ScreenLoader isLoading={isLoadingSearch} />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {auth.profileId !== 2 && <div className="flex flex-row gap-5 items-center">
          <label className="text-gray-900 mb-2 block text-sm font-medium dark:text-white whitespace-nowrap">
            Filtrar por Usuario
          </label>

          <select
            id="type"
            className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            onChange={(e: any) => {
              // console.log("setFilteredData", e.target.value);
              // const userFilteredData = debts.filter((debt) => debt.customerId === Number(e.target.value.trim()))
              // console.log("userFilteredData", userFilteredData.length);
              // setFilteredData(userFilteredData);
              const value = e.target.value;
              setFilterBy(value);
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
          onSearch={handleSearch}
          columns={columns}
          // selectableRows
          viewDetails
          viewAction={setSelectedDebtById}
          viewForm={<ViewDebtForm />}
          // filterField={auth.profileId === 2 ? null : "localCode"}
          filterField={auth.profileId === 2 ? null : filterBy}
          viewTitle="Realizar Pago"
          searchTitle={`Buscar por ${columns.find(c => c.id === filterBy)?.name}`}
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
            </div> : 'Valores por pagar'
          }
        />
      </div>

      {/* <PaymentButton /> */}
      {detailsModalOpen && (
        <div>
          <div
            className={`fixed left-0 top-0 z-999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-6 py-5 ${detailsModalOpen ? "block" : "hidden"
              }`}
          >
            <div
              // ref={detailModal}
              onFocus={() => setDetailsModalOpen(true)}
              className="w-full max-w-180 rounded-lg bg-white px-10 py-14 text-center dark:bg-boxdark md:px-17.5 md:py-15"
            >
              <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                Detalle
              </h3>
              <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
              <div>Detalles del registro</div>

              <ViewDebtForm />

              <button
                onClick={() => setDetailsModalOpen(false)}
                className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
