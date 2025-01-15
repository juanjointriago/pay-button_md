import { FC, useEffect, useState } from "react";
import { useLogsStore } from "../../stores/logs/log.store";
import { DataTableGeneric } from "../../components/DataTables/DataTableGeneric";
import { TableColumn } from "react-data-table-component";
import { LogInterface } from "../../interfaces/logs.interface";
import { useEntitiesStore } from "../../stores/entities/entities.store";
// import DataTableTwo from "../../components/DataTables/DataTableTwo";

// export interface ColumnProps<T> {
//   Header: string;
//   accesor: string;
//   render?: (column: ColumnProps<T>, item: T) => ReactElement | ReactNode;
// }

export const DataLogs: FC = () => {
  const getAllLogs = useLogsStore((state) => state.getAndSetLogs);
  const logs = useLogsStore((state) => state.logs);
  const entities = useEntitiesStore((state) => state.entities);
    const [filteredLogs, setFilteredLogs] = useState(
      logs.filter((log) => log.type === "AUDIT")
    );
  // console.log('🥹 DATA LOGS',data.length)

  useEffect(() => {
    getAllLogs();
  }, [getAllLogs]);

  // const columns = [
  //   { Header: "Id", accesor: "id" },
  //   { Header: "Entidad", accesor: "entity" },
  //   { Header: "Tipo", accesor: "type" },
  //   { Header: "Acción", accesor: "action" },
  //   { Header: "Msj Corto", accesor: "short_msg" },
  //   { Header: "Msj Largo", accesor: "long_msg" },
  //   { Header: "Usuario", accesor: "user" },
  //   { Header: "Ip", accesor: "ip" },
  //   { Header: "Programa", accesor: "program" },
  //   { Header: "Version", accesor: "version" },
  //   { Header: "Fecha", accesor: "createdAt" },
  // ];

  const columns: TableColumn<LogInterface>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "80px",
    },
    {
      name: "Entidad",
      selector: (row) => row.entity,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      name: "Tipo",
      selector: (row) => row.type,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      name: "Accion",
      selector: (row) => row.action,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      name: "Msg Corto",
      selector: (row) => row.short_msg,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    },
    {
      name: "Msg Largo",
      selector: (row) => row.long_msg,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "150px",
    },
    {
      name: "Usuario",
      selector: (row) => row.user,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      name: "IP",
      selector: (row) => row.ip,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      name: "Programa",
      selector: (row) => row.program,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      name: "Version",
      selector: (row) => row.version,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
    {
      name: "Fecha y hora",
      selector: (row) => row.createdAt as any,
      sortable: true,
      style: { paddingLeft: "10px", paddingRight: "10px", textAlign: "left" },
      width: "100px",
    },
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <div className="flex flex-row gap-5">
        <label className="text-gray-900 mb-2 block text-sm font-medium dark:text-white">
          Filtrar por entidades
        </label>
        <select
          id="entities"
          className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
          onChange={(e: any) => {
            console.log("EVENT", e.target.value.toUpperCase());
            setFilteredLogs(
              logs
                .filter((log) => log.type === "DML")
                .filter(
                  (log) =>
                    log.entity.toUpperCase() ===
                    e.target.value.trim().toUpperCase()
                )
            );
          }}
        >
          {entities
            .filter((e) => e.table_name.toUpperCase() !== "PROFILE")
            .map((entity) => (
              <option key={entity.table_name} value={entity.table_name}>
                {entity.table_name}
              </option>
            ))}
        </select>
        <label className="text-gray-900 mb-2 block text-sm font-medium dark:text-white">
          Filtrar por Tipo
        </label>
        <select
          id="type"
          className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
          onChange={(e: any) => {
            console.log("EVENT", e.target.value.toUpperCase());
            setFilteredLogs(
              logs.filter(
                (log) => log.type === e.target.value.trim().toUpperCase()
              )
            );
          }}
        >
          <option key={"DML"} value={"DML"}>
            {" "}
            DML
          </option>
          <option key={"AUDIT"} value={"AUDIT"}>
            {" "}
            AUDIT
          </option>
        </select>
        <label className="text-gray-900 mb-2 block text-sm font-medium dark:text-white">
          Filtrar por Acción
        </label>
        <select
          id="type"
          className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
          onChange={(e: any) => {
            console.log("EVENT", e.target.value.toUpperCase());
            setFilteredLogs(
              logs.filter(
                (log) => log.action.toUpperCase() === e.target.value.trim().toUpperCase()
              )
            );
          }}
        >
          <option key={"INSERT"} value={"INSERT"}>
            {" "}
            INSERT
          </option>
          <option key={"UPDATE"} value={"UPDATE"}>
            {" "}
            UPDATE
          </option>
          <option key={"DELETE"} value={"DELETE"}>
            {" "}
            DELETE
          </option>
        </select>
        {/* <label className="text-gray-900 mb-2 block text-sm font-medium dark:text-white">
          Filtrar por Fecha
        </label> */}
        {/* <DatePickerOne/> */}
        <button
          onClick={() => {
            setFilteredLogs(logs.filter((log) => log.type === "DML"));
          }}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Limpiar Filtros
        </button>
        <div>
        </div>
      </div>
      <DataTableGeneric
        data={filteredLogs}
        columns={columns}
        selectableRows={false}
        filterField="user"
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <div>DB Audit Logs</div>
            {/* <button onClick={()=>alert('En construccion')}>Exportar a excel</button> */}
          </div>
        }
      />
    </div>
  );
};
