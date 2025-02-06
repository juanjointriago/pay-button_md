import { TableColumn } from "react-data-table-component";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { ProfileInterface } from "../../interfaces/profiles.interface";
import { useProfileStore } from "../../stores/profile/profile.store";
import { useEffect, useRef } from "react";
import { AddProfileForm } from "../../components/Forms/AddProfileForm";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ScreenLoader } from "../../components/shared/ScreenLoader";
import { Modal } from "../../components/shared/Modal";
import { useDisclosure } from "../../hooks/useDisclosure";
import { NoAuthorized } from "../../components/shared/NoAuthorized";
import { isAuthorized } from "../../utils/authorization";
import { useAuthStore } from "../../stores/auth/auth.store";

export const DataProfile = () => {
  const user = useAuthStore(state => state.user);
  const getAllProfiles = useProfileStore((state) => state.getProfiles);
  const setSelectedProfileById = useProfileStore((state) => state.setSelectedProfileById);
  const profiles = useProfileStore((state) => state.profiles);
  const editProfile = useProfileStore((state) => state.editProfile);
  const deleteProfile = useProfileStore((state) => state.deleteProfile);
  const deleteIdRef = useRef(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const deleteModal = useDisclosure();


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
              {
                isAuthorized(user, { entity: "PROFILES", role: "ALLOW_UPDATE" }) &&
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
              }

              {
                isAuthorized(user, { entity: "PROFILES", role: "ALLOW_DELETE" }) &&
                <button
                  className="rounded text-rose-400 px-2 py-2 text-lg hover:bg-rose-800/10"
                  key="delete"
                  onClick={async () => {
                    deleteModal.onOpen();
                    deleteIdRef.current = row.id;
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

  if (!isAuthorized(user, { entity: "PROFILES", role: "ALLOW_READ" })) return <NoAuthorized />;

  return (
    <>
      {
        <ScreenLoader isLoading={isDeleting} />
      }
      <div className="container flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <DataTableGeneric
          data={profiles.filter((p) => !!p)}
          columns={columns}
          addTitle="Agregar Perfil"
          onAdd={() => {
            setSelectedProfileById(null);
            navigate('/home/profiles/create')
          }}
          addForm={isAuthorized(user, { entity: "PROFILES", role: "ALLOW_CREATE" }) ? <AddProfileForm /> : undefined}
          editable={isAuthorized(user, { entity: "PROFILES", role: "ALLOW_UPDATE" })}
          editAction={editProfile}
          // editForm={<AddProfileForm />}
          deletable={isAuthorized(user, { entity: "PROFILES", role: "ALLOW_DELETE" })}
          deleteAction={deleteProfile}
          // selectableRows={true}
          filterField="name"
          title="Perfiles "
        />
      </div>


      <Modal
        open={deleteModal.isOpen}
        onToggleModal={deleteModal.toggle}
      >
        <div className="w-full">
          <h1 className="text-title-lg font-semibold text-black dark:text-white">
            Eliminar Perfil
          </h1>

          <p className="text-title-sm font-medium text-black dark:text-white mb-4">
            ¿Está seguro de que desea eliminar el perfil?
          </p>

          <div className="flex justify-between w-full px-12">
            <button
              className="rounded-md bg-gray/60 hover:bg-gray px-3 py-2 font-medium text-black/70 hover:bg-opacity-90 flex items-center gap-2"
              onClick={deleteModal.onClose}
            >
              Cancelar
            </button>

            <button
              className="rounded-md bg-rose-500 px-3 py-2 font-medium text-white hover:bg-opacity-90 flex items-center gap-2"
              onClick={async () => {
                deleteModal.onClose();
                setIsDeleting(true);
                await deleteProfile(deleteIdRef.current);
                setIsDeleting(false);
              }}
            >
              Eliminar
              <FiTrash2 />
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
