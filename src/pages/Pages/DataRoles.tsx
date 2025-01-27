import { TableColumn } from "react-data-table-component";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { useRoleStore } from "../../stores/roles/roles.store";
import { RoleInterface } from "../../interfaces/roles.interface";
import { useEffect } from "react";
import { AddRoleForm } from "../../components/Forms/AddRoleForm";
import { ViewRoleDetail } from "../../components/Forms/ViewRoleDetail";
import { EditRoleForm } from "../../components/Forms/EditRoleForm";

export const DataRoles = () => {
  const getAllRoles = useRoleStore((state) => state.getRoles);
  const roles = useRoleStore((state) => state.roles);
  const deleteRole = useRoleStore((state) => state.deleteRole);
  const setSelectedRoleById = useRoleStore((state) => state.setSelectedRoleById);


  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  const columns: TableColumn<RoleInterface>[] = [
    {
      name: "ID",
      selector: (row) => row.id ?? 0,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "200px",
    },
    {
      name: "Descripción",
      selector: (row) => row.description,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "300px",
    },
    {
      name: "Pantalla de Ejecución",
      selector: (row) => row.entities?.map((e) => e).join(", ") ?? '',
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

  return (
    <div className="container flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <DataTableGeneric
        data={roles}
        columns={columns}
        selectableRows={true}
        deletable
        deleteAction={deleteRole}
        addTitle="Agregar Rol"
        addForm={<AddRoleForm />}
        viewDetails
        viewForm={<ViewRoleDetail />}
        viewAction={setSelectedRoleById}
        editable
        editForm={<EditRoleForm />}
        editAction={setSelectedRoleById}
        onSearch={null}
        filterField="key"
        title="Roles "
      />
    </div>
  );
};
