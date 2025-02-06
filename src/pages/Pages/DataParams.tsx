import { FC, useEffect } from "react";
import { useParamStore } from "../../stores/params/params.store";
import { ParamInterface } from "../../interfaces/params.interface";
import { TableColumn } from "react-data-table-component";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { AddParamForm } from "../../components/Forms/AddParamForm";
import { EditParamForm } from "../../components/Forms/EditParamForm";
import { NoAuthorized } from "../../components/shared/NoAuthorized";
import { isAuthorized } from "../../utils/authorization";
import { useAuthStore } from "../../stores/auth/auth.store";

export const DataParams: FC = () => {
  const getAllParams = useParamStore((state) => state.getAndSetParams);
  const params = useParamStore((state) => state.params);
  const setSelectedParamById = useParamStore((state) => state.setSelectedParamById);
  const deleteParam = useParamStore((state) => state.deleteParam);
  const user = useAuthStore(state => state.user);


  useEffect(() => {
    getAllParams();
  }, [getAllParams]);

  const columns: TableColumn<ParamInterface>[] = [
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
      <DataTableGeneric
        onSearch={null}
        addForm={isAuthorized(user, { entity: "PARAMETERS", role: "ALLOW_CREATE" }) ? <AddParamForm /> : undefined}
        addTitle="Crear Parametro"
        editable={isAuthorized(user, { entity: "PARAMETERS", role: "ALLOW_UPDATE" })}
        editForm={<EditParamForm />}
        editAction={setSelectedParamById}
        deletable={isAuthorized(user, { entity: "PARAMETERS", role: "ALLOW_DELETE" })}
        deleteAction={deleteParam}
        data={params}
        columns={columns}
        selectableRows={true}
        filterField="key"
        title="Configuraciones "
      />
    </div>
  );
};
