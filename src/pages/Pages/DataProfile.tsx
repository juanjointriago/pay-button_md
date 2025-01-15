import { TableColumn } from "react-data-table-component";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { ProfileInterface } from "../../interfaces/profiles.interface";
import { useProfileStore } from "../../stores/profile/profile.store";
import { useEffect } from "react";
import { AddProfileForm } from "../../components/Forms/AddProfileForm";

export const DataProfile = () => {
  const getAllProfiles = useProfileStore((state) => state.getProfiles);
  const profiles = useProfileStore((state) => state.profiles);
  const editProfile = useProfileStore((state) => state.editProfile)
  const deleteProfile = useProfileStore((state) => state.deleteProfile)

  useEffect(() => {
    getAllProfiles();
  }, [getAllProfiles]);

  const columns: TableColumn<ProfileInterface>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
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
        data={profiles.filter((p) => !!p)}
        columns={columns}
        addTitle="Agregar Perfil"
        addForm={<AddProfileForm />}
        editable
        editAction={editProfile}
        editForm={<AddProfileForm />}
        deletable
        deleteAction={deleteProfile}
        selectableRows={true}
        filterField="name"
        title="Perfiles "
      />
    </div>
  );
};
