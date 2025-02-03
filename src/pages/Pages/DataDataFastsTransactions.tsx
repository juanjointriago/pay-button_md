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
import { useDisclosure } from "../../hooks/useDisclosure";
import { Modal } from "../../components/shared/Modal";
import { formatter } from "../../utils/formatter";
import { useForm } from "react-hook-form";

interface IFilterForm {
  lot: string;
  dateStart: string;
  dateEnd: string;
  state: string;
  type: string;
}

export const DataDataFastsTransactions = () => {
  const [data, setData] = useState([]);
  const [filterBy, setFilterBy] = useState('state');
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const detailModal = useDisclosure();
  const [jsonRes, setJsonRes] = useState('');

  const filterForm = useForm<IFilterForm>({
    defaultValues: {
      lot: '',
      dateStart: '',
      dateEnd: '',
      state: 'Todos',
      type: 'DB'
    },
  });

  const columns: TableColumn<IDatafastTransaction>[] = useMemo(() => ([
    {
      id: "actions",
      name: "Acciones",
      button: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left", width: "200px" },
      center: true,
      cell(row) {
        return (
          <div className="flex flex-1 min-w-[200px] mx-auto">
            <button
              onClick={() => {
                setJsonRes(row.jsonResponse);
                detailModal.onOpen();
              }}
              className="rounded px-4 py-2 font-bold text-blue-950 hover:bg-blue-700/15 flex mx-auto"
            >Ver JSON</button>
          </div>
        );
      },
    },
    {
      id: "type",
      name: "Tipo",
      selector: (row) => row.type,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "80px",
    },
    {
      id: "state",
      name: "Estado de la transacción",
      selector: (row) => row.state,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "180px",
    },
    {
      id: "order",
      name: "Orden",
      selector: (row) => row.order,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      id: "executionDate",
      name: "Fecha de Ejecución",
      selector: (row) => `${row.executionDate?.toString().split('T')[0]} ${row.executionDate?.toString().split('T')[1]?.split('.')[0]}`,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "180px",
    },
    {
      id: "trxId",
      name: "Id Trx",
      selector: (row) => row.trxId,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "180px",
    },
    {
      id: "responseText",
      name: "Descripción",
      selector: (row) => row.responseText,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "180px",
    },
    {
      id: "lot",
      name: "Lote",
      selector: (row) => row.lot,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "80px",
    },
    {
      id: "reference",
      name: "Referencia",
      selector: (row) => row.reference,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "120px",
    },
    {
      id: "acquirerId",
      name: "Adq.",
      selector: (row) => row.acquirerId,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "80px",
    },
    {
      id: "authorization",
      name: "Auth.",
      selector: (row) => row.authorization,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "80px",
    },
    {
      id: "amount",
      name: "Monto",
      selector: (row) => formatter({ value: row.amount }),
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
    //   id: "totalAmount",
    //   name: "Monto Total",
    //   selector: (row) => formatter({ value: row.totalAmount }),
    //   sortable: true,
    //   style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
    //   width: "140px",
    // },
  ]), []);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setIsLoadingSearch(true);
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

  const onSubmit = async (data: IFilterForm) => {
    setIsLoadingSearch(true);
    if (data.state === 'Todos') delete data.state;
    if(data.dateEnd) data.dateEnd = `${data.dateEnd} 23:59:59`
    const filterData = Object.keys(data).reduce((acc, key) => data[key]?.trim() ? { ...acc, [key]: data[key] } : acc, {})

    const searchParams = new URLSearchParams(filterData);
    const url = `/transaction`;
    const [error, response] = await to<AxiosResponse<any>>(API.get(url, { params: searchParams }));

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
          <form className="flex flex-col"
            onSubmit={filterForm.handleSubmit(onSubmit)}
          // onSubmit={async (e) => {
          //   e.preventDefault();

          //   if (!filterBy || filterValue.trim() === '') return;
          //   await handleSearch();

          //   let keyValue = filterBy;
          //   let keySubvalue = null;
          //   if (filterBy.includes('.')) {
          //     const key = filterBy.split('.')[0];
          //     const subvalue = filterBy.split('.')[1];
          //     keyValue = key;
          //     keySubvalue = subvalue;
          //   }

          //   setData(data => data.filter(row => {
          //     if (keySubvalue) {
          //       return row[keyValue][keySubvalue].toString().toLowerCase().includes(filterValue.toLowerCase());
          //     }
          //     return row[keyValue].toString().toLowerCase().includes(filterValue.toLowerCase());
          //   }));
          // }}
          >
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 w-full px-14 mt-4">
              <label>
                Lote
                <input
                  className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder={`Buscar por lote`}
                  {...filterForm.register('lot')}
                />
              </label>

              <label>
                Estado
                <select
                  id="type"
                  className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  {...filterForm.register('state')}
                >
                  {
                    ['Todos', 'Procesado', 'Rechazado'].map(state => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))
                  }
                </select>
              </label>

              <label>
                Desde
                <input
                  className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder={`Buscar por lote`}
                  type="date"
                  {...filterForm.register('dateStart')}
                />
              </label>

              <label>
                Hasta
                <input
                  className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder={`Buscar por lote`}
                  type="date"
                  {...filterForm.register('dateEnd')}
                />
              </label>

              {/* <input
                className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg rounded-l-none border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder={`Buscar por ${columns.find(c => c.id === filterBy)?.name}`}
                value={filterValue}
                onChange={(e: any) => {
                  const value = e.target.value;
                  setFilterValue(value);
                }}
              /> */}
            </div>



            <div className="flex mt-8 ml-auto pr-12 mb-4">
              <button
                type="submit"
                className="rounded-md bg-primary px-3 py-2 font-medium text-white hover:bg-opacity-90 flex items-center gap-2 ml-4"
              >
                Buscar <FaSearch />
              </button>

              <button
                type="button"
                className="rounded-md bg-primary px-3 py-2 font-medium text-white hover:bg-opacity-90 flex items-center gap-2 ml-4"
                onClick={() => {
                  filterForm.reset();
                  handleSearch();
                }}
              >
                Limpiar <MdOutlineCleaningServices />
              </button>
            </div>
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


      <Modal
        open={detailModal.isOpen}
        onToggleModal={detailModal.toggle}
        closeOnBlur={false}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">JSON de Respuesta</h3>

        <textarea
          readOnly
          className="w-full h-[400px] p-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none resize-none cursor-default"
        >

          {
            !!jsonRes && JSON.stringify(JSON.parse(jsonRes), null, 2)
          }
        </textarea>

        <div className="flex justify-end mt-4">
          <button
            className="rounded px-4 py-2 font-bold text-blue-950 hover:bg-blue-700/15 flex mx-auto"
            onClick={detailModal.onClose}
          >Cerrar</button>
        </div>
      </Modal>
    </>
  )
}
