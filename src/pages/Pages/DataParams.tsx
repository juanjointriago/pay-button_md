import { FC, useEffect, useState } from "react";
import { useParamStore } from "../../stores/params/params.store";
import { ParamInterface } from "../../interfaces/params.interface";
import { TableColumn } from "react-data-table-component";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { AddParamForm } from "../../components/Forms/AddParamForm";
import { EditParamForm } from "../../components/Forms/EditParamForm";
import { NoAuthorized } from "../../components/shared/NoAuthorized";
import { isAuthorized } from "../../utils/authorization";
import { useAuthStore } from "../../stores/auth/auth.store";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDisclosure } from "../../hooks/useDisclosure";
import { Modal } from "../../components/shared/Modal";
import Swal from "sweetalert2";
import { ScreenLoader } from "../../components/shared/ScreenLoader";

export const DataParams: FC = () => {
  const getAllParams = useParamStore((state) => state.getAndSetParams);
  const params = useParamStore((state) => state.params);
  const setSelectedParamById = useParamStore((state) => state.setSelectedParamById);
  const deleteParam = useParamStore((state) => state.deleteParam);
  const user = useAuthStore(state => state.user);
  const editModal = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllParams();
  }, [getAllParams]);

  const columns: TableColumn<ParamInterface>[] = [
    {
      name: "Acciones",
      selector: (row) => row.id,
      sortable: false,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
      cell: (row) => {
        return (
          <div className="flex flex-row justify-between">
            {
              isAuthorized(user, { entity: "PARAMETERS", role: "ALLOW_UPDATE" }) &&
              <button
                className="rounded text-indigo-500 px-2 py-2 text-lg hover:bg-indigo-800/10"
                onClick={() => {
                  if (!isAuthorized(user, { entity: "PARAMETERS", role: "ALLOW_UPDATE" })) return;
                  setSelectedParamById(row.id);
                  editModal.toggle()
                }}
              >
                <FiEdit />
              </button>
            }

            {
              isAuthorized(user, { entity: "PARAMETERS", role: "ALLOW_DELETE" }) &&
              <button
                className="rounded text-rose-400 px-2 py-2 text-lg hover:bg-rose-800/10"
                onClick={async () => {
                  if (!isAuthorized(user, { entity: "PARAMETERS", role: "ALLOW_DELETE" })) return;
                  const confirmed = await Swal.fire({
                    icon: "warning",
                    title: "¿Está seguro?",
                    text: "Está a punto de eliminar el usuario",
                    showCancelButton: true,
                    confirmButtonColor: "green",
                    cancelButtonColor: "red",
                    confirmButtonText: "Si, adelante!",
                    cancelButtonText: "No, cancelar!",
                  });
                  
                  if (confirmed.isConfirmed) {
                    setIsLoading(true);
                    await deleteParam(row.id);
                    setIsLoading(false);
                  }
                }}
              >
                <FiTrash2 />
              </button>
            }
          </div>
        );
      },
    },
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      name: "Nombre",
      selector: (row) => row.key,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "200px",
    },
    {
      name: "Valor",
      selector: (row) => row.value,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "300px",
    },
    {
      name: "Activo",
      selector: (row) => row.active,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "max-content",
    },
  ];

  if (!isAuthorized(user, { entity: "PARAMETERS", role: "ALLOW_READ" })) return <NoAuthorized />;

  return (
    <div className="container flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <ScreenLoader isLoading={isLoading} />

      <DataTableGeneric
        onSearch={null}
        addForm={isAuthorized(user, { entity: "PARAMETERS", role: "ALLOW_CREATE" }) ? <AddParamForm /> : undefined}
        addTitle="Crear Parametro"
        // editable={isAuthorized(user, { entity: "PARAMETERS", role: "ALLOW_UPDATE" })}
        // editForm={<EditParamForm />}
        // editAction={setSelectedParamById}
        // deletable={isAuthorized(user, { entity: "PARAMETERS", role: "ALLOW_DELETE" })}
        // deleteAction={deleteParam}
        data={params}
        columns={columns}
        // selectableRows={true}
        filterField="key"
        title="Configuraciones "
      />

      <Modal open={editModal.isOpen} onToggleModal={editModal.toggle}>
        <div className="p-8">
          <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            Editar Perfil
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>

          <EditParamForm />

          <button
            onClick={() => editModal.onClose()}
            className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
};
