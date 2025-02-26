import { FC, useEffect, useState } from "react";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { useUserStore } from "../../stores/users/users.store";
import { TableColumn } from "react-data-table-component";
import { UserInterface } from "../../interfaces/user.interface";
import { AddUserForm } from "../../components/Forms/AddUserForm";
import { EditUserForm } from "../../components/Forms/EditUserForm";
import { isAuthorized } from "../../utils/authorization";
import { NoAuthorized } from "../../components/shared/NoAuthorized";
import { useAuthStore } from "../../stores/auth/auth.store";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Modal } from "../../components/shared/Modal";
import { useDisclosure } from "../../hooks/useDisclosure";
import Swal from "sweetalert2";
import { ScreenLoader } from "../../components/shared/ScreenLoader";
import { MdLockReset } from "react-icons/md";
import { UpdatePasswordForm } from "../../components/Forms/UpdatePasswordForm";

export const DataUsers: FC = () => {
  const user = useAuthStore((state) => state.user);
  const getAllUsers = useUserStore((state) => state.getUsers);
  const users = useUserStore((state) => state.users);
  const setSelectedUserById = useUserStore((state) => state.setSelectedUserById);
  // const getRoleById = useRoleStore((state) => state.getRoleById);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const editUserModal = useDisclosure();
  const [filterBy, setFilterBy] = useState("username");
  const [isLoading, setIsLoading] = useState(false);
  const updatePasswordModal = useDisclosure();

  const [dataUsers, setDataUsers] = useState<UserInterface[]>(users);

  useEffect(() => {
    setDataUsers(users);
  }, [users]);

  useEffect(() => {
    if (users.length === 0) {
      getAllUsers();
      //  window.location.href = window.location.href;
    }
  }, [getAllUsers]);

  useEffect(() => {
    if (users.length === 0) window.location.reload();
  }, []);

  const columns: (TableColumn<UserInterface> & { notFiltable?: boolean })[] = [
    {
      id: 'actions',
      notFiltable: true,
      name: "Acciones",
      selector: (row) => row.id,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "120px",
      cell(row) {
        return (
          <div className="flex flex-1 min-w-[320px] mx-auto">
            <div className="flex">
              {
                <button
                  className="rounded text-purple-400 px-2 py-2 text-xl hover:bg-rose-800/10"
                  key="delete"
                  onClick={async () => {
                    setSelectedUserById(row.id);
                    updatePasswordModal.onOpen();
                  }}
                >
                  <MdLockReset />
                </button>
              }

              {
                isAuthorized(user, { entity: "PROFILES", role: "ALLOW_UPDATE" }) &&
                <button
                  className="rounded text-indigo-500 px-2 py-2 text-lg hover:bg-indigo-800/10"
                  key="edit"
                  onClick={() => {
                    if (!isAuthorized(user, { entity: "USERS", role: "ALLOW_UPDATE" })) return;
                    setSelectedUserById(row.id);
                    editUserModal.onOpen();
                  }}
                >
                  <FiEdit />
                </button>
              }

              {
                isAuthorized(user, { entity: "PROFILES", role: "ALLOW_DELETE" }) &&
                <button
                  className="rounded text-rose-400 px-2 py-2 text-lg hover:bg-rose-800/10"
                  key="delete"
                  onClick={async () => {
                    if (!isAuthorized(user, { entity: "USERS", role: "ALLOW_DELETE" })) return;
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
                      await deleteUser(row.id);
                      setIsLoading(false);
                    }
                  }}
                >
                  <FiTrash2 />
                </button>
              }
            </div>
          </div>
        );
      },
    },
    {
      id: "id",
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "90px",
      notFiltable: true,
    },
    {
      id: "username",
      name: "Nombre Usuario",
      selector: (row) => row.username,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    },
    {
      id: "email",
      name: "email",
      selector: (row) => row.email,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "250px",
    },
    {
      id: "profileId",
      name: "Perfil",
      selector: (row) => row.profileId,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      id: "active",
      name: "Activo",
      selector: (row) => row.active,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "90px",
    },
    {
      id: "createdAt",
      name: "Fecha de Creación",
      selector: (row) => row.createdAt as any,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "200px",
    },
    // {
    //   name: "Fecha de Creación",
    //   selector: (row) => row.updatedAt as any,
    //   sortable: true,
    //   style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
    //   width: "200px",
    // },
  ];

  if (!isAuthorized(user, { entity: "USERS", role: "ALLOW_READ" })) return <NoAuthorized />;

  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <div className="flex flex-row items-center">
        {/* <label className="text-gray-900 mb-2 block text-sm font-medium dark:text-white whitespace-nowrap">
          Filtrar por Usuario
        </label> */}

        <ScreenLoader isLoading={isLoading} />

        <select
          id="type"
          className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500 basis-1/4 rounded-r-none"
          onChange={(e: any) => {
            const value = e.target.value;
            setFilterBy(value);
          }}
        >
          {
            columns.filter(column => !column.notFiltable).map(column => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))
          }
        </select>

        <input
          className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-l-none border-l-0"
          placeholder={`Buscar por ${columns.find(c => c.id == filterBy)?.name}`}
          onChange={(e: any) => {
            const value = e.target.value;

            if (value === '') return setDataUsers(users);
            const newUsers = users.filter((user) => user[filterBy].toLowerCase().includes(value.toLowerCase()));
            setDataUsers(newUsers);
          }}
        />
      </div>

      <DataTableGeneric
        onSearch={null}
        allowCsvExport={isAuthorized(user, { entity: "USERS", role: "ALLOW_EXPORT_CSV" })}
        data={dataUsers.filter((user) => !!user)}
        addTitle="Agregar Usuario"
        addForm={isAuthorized(user, { entity: "USERS", role: "ALLOW_CREATE" }) ? <AddUserForm /> : undefined}
        columns={columns}
        filterField="username"
        title="Usuarios"
      />

      <Modal open={editUserModal.isOpen} onToggleModal={editUserModal.toggle} maxW="max-w-2xl">
        <div className="p-8">
          <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            Editar Perfil
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>

          <EditUserForm />

          <button
            onClick={() => editUserModal.onClose()}
            className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
          >
            Cancelar
          </button>
        </div>
      </Modal>


      <Modal open={updatePasswordModal.isOpen} onToggleModal={updatePasswordModal.toggle} maxW="max-w-2xl">
        <div className="p-8">
          <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            Actualizar Contraseña
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>

          <UpdatePasswordForm onSubmit={updatePasswordModal.onClose} />

          <button
            onClick={() => updatePasswordModal.onClose()}
            className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
};
