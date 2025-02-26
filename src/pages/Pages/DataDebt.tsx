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
import { usePayment } from "../../hooks/usePayment";
import { formatter } from "../../utils/formatter";
import { NoAuthorized } from "../../components/shared/NoAuthorized";
import { isAuthorized } from "../../utils/authorization";

export const DataDebt = () => {
  // const users = useUserStore((state) => state.users);
  // const debts = useDebts((state) => state.debts);
  // const selectedDebt = useDebts((state) => state.selectedDebt);
  const setSelectedDebtById = useDebts((state) => state.setSelectedDebtById);
  const user = useAuthStore((state) => state.user);

  // const [filterBy, setFilterBy] = useState('localCode');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // const [selectedRows, setSelectedRows] = useState([]);

  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [filterBy, setFilterBy] = useState(SelectorKeys["CONSULTA DEUDA PREDIAL URBANO Y RUSTICOS"]);
  const [debts, setDebts] = useState([]);
  const { PaymentModal, generateCheckoutId, isLoadingCheckout } = usePayment();
  // const useRef(null);

  const columns: TableColumn<DebtInterface>[] = [
    {
      id: 'year',
      name: "AÑO",
      selector: (row) => row.year,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "80px",
    },
    {
      id: "localCode",
      name: "Código Local",
      selector: (row) => row.localCode,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "180px",
    },
    // {
    //   id: "identification",
    //   name: "ID Cliente",
    //   selector: (row) => row.identification,
    //   sortable: true,
    //   style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
    //   width: "120px",
    // },
    {
      id: "titleName",
      name: "Detalle",
      selector: (row) => row.titleName,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "300px",
      cell(row) {
        return (
          <div className="flex flex-1 min-w-[300px] mx-auto">
            <div className="flex flex-col">
              <p className="text-sm">{row.titleName}</p>
              {/* <div className="text-xs text-gray-500">{row.identification}</div> */}
            </div>
          </div>
        );
      },
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
      id: 'surcharge',
      name: "Recargo",
      selector: (row) => row.surcharge,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "120px",
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
      id: "totalAmount",
      name: "Total",
      selector: (row) => formatter({ value: row.totalAmount }),
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
      name: "Predio",
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
      id: 'createdAt',
      name: "Fecha de Registro",
      selector: (row) => row.createdAt.toString(),
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    }
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
    const url = `debt?${params.toString()}`;

    const [error, response] = await to<AxiosResponse<any>>(API.get(url, {
      headers: {
        'Content-Type': 'application/json',
      }
    }));
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
    // } else {
    //   const searchValue = formValues['codigoCatastral'];

    // TODO: CALL API SERVICE FOR CLIENT
    // }
    setIsLoadingSearch(false);
  }

  const handlePay = async (rows: any) => {
    // console.log(rows);
    setDetailsModalOpen(false);
    const paymentValues = {
      customerId: user.id,
      debtIds: rows.map(row => row.id)
    }

    generateCheckoutId(paymentValues);
  };


  if (!isAuthorized(user, { entity: "DEBTS", role: "ALLOW_READ_DEBTS" })) return <NoAuthorized />;


  return (
    <>
      <ScreenLoader isLoading={isLoadingSearch || isLoadingCheckout} />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {
          <div className="flex flex-row gap-5 items-center">
            <label className="text-gray-900 mb-2 block text-sm font-medium dark:text-white whitespace-nowrap">
              Filtrar por Usuario
            </label>

            <select
              id="type"
              className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChange={(e: any) => {
                const value = e.target.value;
                setFilterBy(value);
              }}
            >
              {
                selectOptions.map(column => (
                  <option key={column.id} value={column.id}>
                    {column.name}
                  </option>
                ))
              }
            </select>
          </div>
        }

        <DataTableGeneric
          showAmount
          allowCsvExport={isAuthorized(user, { entity: "DEBTS", role: "ALLOW_EXPORT_CSV_DEBTS" })}
          data={debts}
          onSearch={handleSearch}
          onStartPayment={(rows) => {
            if (!isAuthorized(user, { entity: "DEBTS", role: "ALLOW_PAYMENT" })) return Swal.fire("Error", "No tienes permisos para realizar esta acción", "error");
            handlePay(rows);
          }}
          columns={columns}
          selectableRows
          viewDetails
          viewAction={setSelectedDebtById}
          viewForm={<ViewDebtForm />}
          filterField={filterBy}
          viewTitle="Realizar Pago"
          searchTitle={`Buscar por ${columns.find(c => c.id === filterBy)?.name}`}
          fieldPlaceHolder="Ej. 1.4.9.9.3.3.3."
          title={
            user.profile.id !== 2 ? <div
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

              {/* <ViewDebtForm 
                onStartPayment={handlePay}
              /> */}

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


      {
        PaymentModal
      }
    </>
  );
};
