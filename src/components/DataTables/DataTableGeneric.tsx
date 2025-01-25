import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import Loader from "../../common/Loader";
import Swal from "sweetalert2";
import { FaFileExcel, FaSearch } from 'react-icons/fa'
import { SelectorKeys } from "../../pages/Pages/DataTransactions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PaymentButton } from "../Payment/PaymentButton";
import { useAuthStore } from "../../stores/auth/auth.store";

type data = any[];
type columns = any[];
interface Props {
  data: data;
  columns: columns;
  selectableRows?: boolean;
  searchTitle?: string,
  fieldPlaceHolder?: string;
  filterField?: string;
  title?: string | React.ReactNode;
  viewDetails?: boolean;
  viewTitle?: string;
  viewForm?: React.ReactNode;
  viewAction?: any;
  addTitle?: string;
  addForm?: React.ReactNode;
  editable?: boolean;
  editAction?: any;
  editForm?: React.ReactNode;
  deletable?: boolean;
  deleteAction?: any;
  payable?: boolean;
  onSearch: any;
}

const Export = ({ onExport }) => (
  <button
    key={`exportbtn`}
    id="exportbtn"
    className="rounded-md bg-success px-3 py-2 font-medium text-white hover:bg-opacity-90"
    onClick={(e: any) => onExport(e.target.value)}
  >
    <FaFileExcel />
  </button>
);

const zod = z.object({
  localCode: z.string().trim().nullable(), // codigo catastral
  actionLiquidationType: z.number().min(1).max(3).nullable(), // tipo de liquidacion
  liquidationCode: z.string().nullable(), // codigo de liquidacion
  ext: z.string().trim().nullable(), // codigo extension (codigo de local)
})
  .refine((data) => {
    if (data.actionLiquidationType.toString() === SelectorKeys["CONSULTA DEUDA POR EL CODIGO DE LA LIQUIDACION"] && !data.liquidationCode?.trim()) return false;
    return true;
  }, {
    path: ['liquidationCode'],
    message: 'Debe ingresar el codigo de la liquidación',
  })
  .refine((data) => {
    if (data.actionLiquidationType.toString() !== SelectorKeys["CONSULTA DEUDA POR EL CODIGO DE LA LIQUIDACION"] && !data.localCode?.trim()) return false;
    return true;
  }, {
    path: ['localCode'],
    message: 'Debe ingresar el código catastral',
  })
  .refine((data) => {
    if (data.actionLiquidationType.toString() === SelectorKeys["CONSULTA DEUDA PERMISO DE FUNCIONAMIENTO"] && !data.ext?.trim()) return false;
    return true;
  }, {
    path: ['ext'],
    message: 'Debe ingresar el codigo de local',
  });

type FormValues = z.infer<typeof zod>;

export const DataTableGeneric: FC<Props> = ({
  columns,
  data,
  selectableRows = false,
  filterField,
  fieldPlaceHolder = 'Buscar',
  searchTitle = 'Buscar',
  title = "Data Table",
  viewTitle = "Ver detalles",
  viewDetails = false,
  viewForm,
  viewAction,
  addTitle,
  addForm,
  editable = false,
  editAction,
  editForm = null,
  deletable = false,
  deleteAction,
  onSearch,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const user = useAuthStore((state) => state.user);  

  const form = useForm<FormValues>({
    resolver: zodResolver(zod),
    defaultValues: {
      actionLiquidationType: Number(filterField),
      localCode: null,
      liquidationCode: null,
      ext: null,
    },
  });

  //for selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const [toggleCleared, setToggleCleared] = useState(false);


  const contextActions = useMemo(() => {
    const handleEdit = () => {
      if (selectedRows.length > 1) {
        Swal.fire({
          icon: "error",
          title: "Oops...", // 'Oops...',
          text: "Debes seleccionar una sola fila", // 'Debes seleccionar una sola fila',
          confirmButtonColor: "blue",
        });
        return;
      }
      Swal.fire({
        icon: "info",
        title: "Datos a editar", // 'Oops...',
        text:
          "Va editar datos del registro Nro: " + selectedRows.map((r) => r?.id), // 'Debes seleccionar una sola fila',
        confirmButtonColor: "blue",
        confirmButtonText: "Si, adelante!",
        cancelButtonText: "No, cancelar!",
        cancelButtonColor: "blue",
      }).then((result) => {
        if (result.isConfirmed) {
          editable && editForm !== null && setEditModalOpen(true);
          console.log("✏️ edittt =>", selectedRows[0]);
          console.log("✏️ ID =>", selectedRows[0].id);
          editAction(selectedRows[0].id);
          return;
        }
        Swal.fire({
          icon: "warning",
          title: "Opps",
          text: " Formulario no configurado ", // 'Debes seleccionar una sola fila',
          confirmButtonColor: "blue",
        });
      });
      console.log("edit", selectedRows);
    };
    
    const handleViewDetails = () => {
      if (selectedRows.length > 1) {
        Swal.fire({
          icon: "error",
          title: "Oops...", // 'Oops...',
          text: "Debes seleccionar una sola fila", // 'Debes seleccionar una sola fila',
          confirmButtonColor: "blue",
        });
        return;
      }
      viewDetails && viewForm !== null && setDetailsModalOpen(true);
      console.log("✏️ view =>", selectedRows[0]);
      viewAction(selectedRows[0].id);
      console.log("view", selectedRows);
    };

    const handleDelete = () => {
      Swal.fire({
        title: "Está seguro",
        text:
          "Está a punto de eliminar el/los registros : " +
          selectedRows.map((r) => r?.id),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, adelante!",
        confirmButtonColor: "green",
        cancelButtonText: "No, cancelar!",
        cancelButtonColor: "blue",
        reverseButtons: true,
      }).then((result) => {
        console.log(result);
        if (result.isConfirmed) {
          if (!deleteAction) {
            Swal.fire({
              icon: "warning",
              title: "Oops...", // 'Oops...',
              text: "No se ha configurado una acción de eliminación ", // 'Debes seleccionar una sola fila',
              confirmButtonColor: "blue",
            });
            return;
          }
          selectedRows.forEach((row) => {
            console.log("🗑️ deleting => ", { row });
            deleteAction(row.id);
          });
          setToggleCleared(!toggleCleared);
        }
        window.location.reload();
      });
    };

    return (
      <div className="flex gap-2">
        {editable && (
          <button
            className="rounded-md bg-primary px-3 py-2 font-medium text-white hover:bg-opacity-90"
            key="edit"
            onClick={handleEdit}
          >
            Modificar
          </button>
        )}
        {deletable && (
          <button
            className="rounded-md bg-danger px-3 py-2 font-medium text-white hover:bg-opacity-90"
            key="delete"
            onClick={handleDelete}
          >
            Eliminar
          </button>
        )}
        {viewDetails && (
          // <button
          //   className="rounded-md bg-danger px-3 py-2 font-medium text-white hover:bg-opacity-90"
          //   key="viewdetails"
          //   onClick={handleViewDetails}
          // >
          //   {viewTitle}
          // </button>

          <PaymentButton 
            onStartPayment={(onStartPayment) => {
              if(selectedRows.length > 1) return;
              const paymentValues = {
                customerId: user.id,
                debtId: selectedRows[0].id,
              }
              onStartPayment(paymentValues);
            }}
          />
        )}
        {/* {viewDetails && (
          <button
            className="rounded-md bg-danger px-3 py-2 font-medium text-white hover:bg-opacity-90"
            key="viewdetails"
            onClick={handleViewDetails}
          >
            {viewTitle}
          </button>
        )} */}
      </div>
    );
  }, [data, selectedRows, toggleCleared]);

  const addRef = useRef<any>(null);
  const modal = useRef<any>(null);
  const editModal = useRef<any>(null);
  const detailModal = useRef<any>(null);


  useEffect(() => {
    form.reset({
      localCode: null,
      actionLiquidationType: Number(filterField),
      liquidationCode: null,
      ext: null,
    })
  }, [filterField]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!modal.current) return;
      if (
        !modalOpen ||
        modal.current.contains(target) ||
        addRef.current.contains(target)
      )
        return;
      setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // const [records, setRecords] = useState([...data]);


  // const handleChange = (e) => {
  //   // const filteredRedcords = data.filter((record) => {
  //   //   return record[`${filterField}`]
  //   //     .toString()
  //   //     .toLowerCase()
  //   //     .includes(e.target.value.toLowerCase());
  //   // });
  //   // setRecords(filteredRedcords);
  // };

  const convertArrayOfObjectsToCSV = (array) => {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  };

  // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
  const downloadCSV = (array) => {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  };

  const exportMemo = useMemo(
    () => <Export key={`exportbtn_`} onExport={() => downloadCSV(data)} />,
    []
  );

  const addButton = (
    <button
      ref={addRef}
      onClick={() => setModalOpen(!modalOpen)}
      className="rounded-md bg-primary px-3 py-2 font-medium text-white hover:bg-opacity-90"
    >
      {addTitle ?? "Nuevo registro"}
    </button>
  );


  // console.log(filterField);

  return (
    <>
      <div className="container mx-auto flex justify-center items-center">
        {filterField && (
          <form
            className="flex items-center w-full gap-4"
            onSubmit={form.handleSubmit(onSearch)}
          >
            <div className="flex items-center gap-8 w-full">
              <div className="flex items-center w-full gap-2">
                {
                  SelectorKeys["CONSULTA DEUDA POR EL CODIGO DE LA LIQUIDACION"] === filterField ? (
                    <>
                      <label className="whitespace-nowrap font-semibold">Código de la Liquidación</label>
                      <div className="w-full">
                        <input
                          key={filterField}
                          type="text"
                          placeholder={`${fieldPlaceHolder}`}
                          className="w-full rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                          {...form.register("liquidationCode")}
                        />
                        {
                          form.formState.errors && form.formState.errors.liquidationCode && form.formState.errors.liquidationCode.message && (
                            <p className="text-rose-400 text-xs italic">
                              {form.formState.errors.liquidationCode.message}
                            </p>
                          )
                        }
                      </div>
                    </>
                  )
                    : (
                      <>
                        <label className="whitespace-nowrap font-semibold">Código catastral</label>
                        <div className="w-full">
                          <input
                            key={filterField}
                            type="text"
                            placeholder={`${fieldPlaceHolder}`}
                            className="w-full rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                            {...form.register("localCode")}
                          />
                          {
                            form.formState.errors && form.formState.errors.localCode && form.formState.errors.localCode.message && (
                              <p className="text-rose-400 text-xs italic">
                                {form.formState.errors.localCode.message}
                              </p>
                            )
                          }
                        </div>
                      </>
                    )
                }
              </div>

              {
                SelectorKeys["CONSULTA DEUDA PERMISO DE FUNCIONAMIENTO"] === filterField &&
                <div className="flex items-center gap-2 w-full">
                  <label className="whitespace-nowrap font-semibold">Número de Local:</label>
                  <div>
                    <input
                      key={filterField}
                      type="number"
                      placeholder={`${fieldPlaceHolder}`}
                      className="w-full rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                      {...form.register("ext")}
                    />
                    {
                      form.formState.errors && form.formState.errors.ext && form.formState.errors.ext.message && (
                        <p className="text-rose-400 text-xs italic">
                          {form.formState.errors.ext.message}
                        </p>
                      )
                    }
                  </div>
                </div>
              }
            </div>

            <button
              type="submit"
              className="rounded-md bg-primary px-3 py-2 font-medium text-white hover:bg-opacity-90 flex items-center gap-2"
            >
              Buscar <FaSearch />
            </button>
          </form>
        )}
      </div>
      <DataTable
        actions={[exportMemo, addForm && addButton]}
        key={addTitle}
        keyField="id"
        contextActions={contextActions}
        contextMessage={{
          singular: "registro",
          plural: "registros",
          message: "seleccionado",
        }}
        paginationComponentOptions={{
          rowsPerPageText: "Registros por página:",
          rangeSeparatorText: "de",
          selectAllRowsItem: true,
          selectAllRowsItemText: "Todos",
        }}
        // expandableRows={true}
        // expandableRowsComponent={MyExpander}
        // expandableRowsComponentProps={{name: 'Ver detalles...'}}
        title={title}
        columns={columns}
        // data={data}
        data={data}
        selectableRows={selectableRows}
        fixedHeader={false}
        pagination
        responsive
        noDataComponent="No se encontraron registros ..."
        // progressPending={!data.length}
        progressComponent={<Loader />}
        onSelectedRowsChange={handleRowSelected}
      />
      {addTitle && (
        <div>
          <div
            className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${modalOpen ? "block" : "hidden"
              }`}
          >
            <div
              ref={modal}
              onFocus={() => setModalOpen(true)}
              // onBlur={() => setModalOpen(false)}
              className="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:px-17.5 md:py-15"
            >
              <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                Agregar {title}
              </h3>
              <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
              {addForm ?? <div>Formulario</div>}
              <button
                onClick={() => setModalOpen(false)}
                className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {editable && (
        <div>
          <div
            className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${editModalOpen ? "block" : "hidden"
              }`}
          >
            <div
              ref={editModal}
              onFocus={() => setEditModalOpen(true)}
              className="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:px-17.5 md:py-15"
            >
              <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                Editar {title}
              </h3>
              <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
              {editForm ?? <div>Formulario</div>}
              <button
                onClick={() => setEditModalOpen(false)}
                className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {viewDetails && (
        <div>
          <div
            className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-6 py-5 ${detailsModalOpen ? "block" : "hidden"
              }`}
          >
            <div
              ref={detailModal}
              onFocus={() => setDetailsModalOpen(true)}
              className="w-full max-w-180 rounded-lg bg-white px-10 py-14 text-center dark:bg-boxdark md:px-17.5 md:py-15"
            >
              <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                Detalle {title}
              </h3>
              <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
              {viewForm ?? <div>Detalles del registro</div>}
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
