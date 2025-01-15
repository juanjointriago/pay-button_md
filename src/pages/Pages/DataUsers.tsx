import { FC, useEffect } from "react";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { useUserStore } from "../../stores/users/users.store";
import { TableColumn } from "react-data-table-component";
import { UserInterface } from "../../interfaces/user.interface";
// import { useRoleStore } from "../../stores/roles/roles.store";
import { AddUserForm } from "../../components/Forms/AddUserForm";
import { EditUserForm } from "../../components/Forms/EditUserForm";

export const DataUsers: FC = () => {
  const getAllUsers = useUserStore((state) => state.getUsers);
  const users = useUserStore((state) => state.users);
  const setSelectedUserById = useUserStore((state) => state.setSelectedUserById);
  // const getRoleById = useRoleStore((state) => state.getRoleById);
  const deleteUser = useUserStore((state) => state.deleteUser);

  useEffect(() => {
    if(users.length === 0){
      getAllUsers();
      //  window.location.href = window.location.href;
    }
  }, [getAllUsers]);

  useEffect(() => {
    if(users.length === 0 )window.location.reload();
  }, []);

  const columns: TableColumn<UserInterface>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "90px",
    },
    {
      name: "Nombre Usuario",
      selector: (row) => row.username,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    },
    {
      name: "email",
      selector: (row) => row.email,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "250px",
    },
    
    {
      name: "Perfil",
      selector: (row) => (row.profileId === 1 ? "Admin" : "User"),
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      name: "Activo",
      selector: (row) => row.active,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "90",
    },
    {
      name: "Fecha de Creación",
      selector: (row) => row.createdAt as any,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "200px",
    },
    {
      name: "Fecha de Creación",
      selector: (row) => row.updatedAt as any,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "200px",
    },
  ];
// console.log('💩 Usuarios =>',{users})
  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      { <DataTableGeneric
        data={users.filter((user)=>!!user)}
        addTitle="Agregar Usuario"
        addForm={<AddUserForm />}
        editable
        editForm={<EditUserForm />}
        editAction={setSelectedUserById}
        deletable
        deleteAction={deleteUser}
        columns={columns}
        selectableRows
        filterField="username"
        title="Usuarios"
      />}
    </div>
  );
};
