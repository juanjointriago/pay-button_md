import { TableColumn } from "react-data-table-component";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { ProfileInterface } from "../../interfaces/profiles.interface";
import { useProfileStore } from "../../stores/profile/profile.store";
import { useEffect } from "react";
import { AddProfileForm } from "../../components/Forms/AddProfileForm";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate, Navigate } from 'react-router-dom';

export const DataProfile = () => {
  const getAllProfiles = useProfileStore((state) => state.getProfiles);
  const setSelectedProfileById = useProfileStore((state) => state.setSelectedProfileById);
  const profiles = useProfileStore((state) => state.profiles);
  const editProfile = useProfileStore((state) => state.editProfile);
  const deleteProfile = useProfileStore((state) => state.deleteProfile);

  const navigate = useNavigate();

  useEffect(() => {
    getAllProfiles();
  }, [getAllProfiles]);

  const columns: TableColumn<ProfileInterface>[] = [
    {
      id: 'actions',
      name: "Acciones",
      selector: (row) => row.id,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
      cell(row) {
        return (
          <div className="flex flex-1 min-w-[320px] mx-auto">
            <div className="flex gap-2">
              <button
                className="rounded text-indigo-500 px-2 py-2 text-lg hover:bg-indigo-800/10"
                key="edit"
                onClick={() => {
                  setSelectedProfileById(row.id);
                  navigate(`/home/profiles/update/${row.id}`)
                }}
              >
                <FiEdit />
              </button>

              <button
                className="rounded text-rose-400 px-2 py-2 text-lg hover:bg-rose-800/10"
                key="delete"
              // onClick={() => deleteProfile(row.id)}
              >
                <FiTrash2 />
              </button>
            </div>
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
        onAdd={() => {
          setSelectedProfileById(null);
          navigate('/home/profiles/create')
        }}
        addForm={<AddProfileForm />}
        editable
        editAction={editProfile}
        // editForm={<AddProfileForm />}
        deletable
        deleteAction={deleteProfile}
        // selectableRows={true}
        filterField="name"
        title="Perfiles "
      />
    </div>
  );
};
