import { useEffect } from "react";
import { useEntitiesStore } from "../../stores/entities/entities.store";
import { TableColumn } from "react-data-table-component";
import { Entity } from "../../interfaces/entities.interface";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { AddEntityForm } from "../../components/Forms/AddEntityForm";

export const Entities = () => {
  const getAllEntities = useEntitiesStore((state) => state.getAndSetEntities);
  const entities = useEntitiesStore((state) => state.entities);

  useEffect(() => {
    getAllEntities();
  }, [getAllEntities]);

  const columns: TableColumn<Entity>[] = [
    {
      name: "Nombre",
      selector: (row) => row.table_name,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "200px",
    },
    {
      name: "Monitoreada",
      selector: (row) => row.has_audited,
      cell: (row, index) => <code key={index}>{row.has_audited === 1 ? "Si" : "No"}</code>,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "max-content",
    },
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <DataTableGeneric
        addTitle="Auditar Ent."
        deleteAction={() => console.log("delete")}
        addForm={<AddEntityForm id={"entityForm"} />}
        data={entities}
        columns={columns}
        filterField="username"
        title="Tablas"
      />
    </div>
  );
};
