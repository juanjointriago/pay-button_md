import { FC, useEffect } from "react";
import { useParamStore } from "../../stores/params/params.store";
import { ParamInterface } from "../../interfaces/params.interface";
import { TableColumn } from "react-data-table-component";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { AddParamForm } from "../../components/Forms/AddParamForm";
import { EditParamForm } from "../../components/Forms/EditParamForm";

export const DataParams: FC = () => {
  const getAllParams = useParamStore((state) => state.getAndSetParams);
  const params = useParamStore((state) => state.params);
  const setSelectedParamById = useParamStore((state) => state.setSelectedParamById);
  const deleteParam = useParamStore((state) => state.deleteParam)


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
  return (
    <div className="container flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <DataTableGeneric
      onSearch={null}
        addForm={<AddParamForm />}
        addTitle="Crear Parametro"
        editable
        editForm={<EditParamForm />}
        editAction={setSelectedParamById}
        deletable
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
