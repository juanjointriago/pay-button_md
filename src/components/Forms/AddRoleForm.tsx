import { useState } from "react";
import { useRoleStore } from "../../stores/roles/roles.store";
import Swal from "sweetalert2";
import { PostRoleInterface } from "../../interfaces/roles.interface";
import Loader from "../../common/Loader";
import { useEntitiesStore } from "../../stores/entities/entities.store";

export const AddRoleForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const entities = useEntitiesStore((state) => state.entities);
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const addRole = useRoleStore((state) => state.addRole);
  const handleSaveRole = async () => {
    setIsLoading(true);
    console.log("name", name);
    console.log("description", description);
    console.log("selectedEntities", { selectedEntities });
    if (name === "" || description === "" || selectedEntities.length === 0) {
      Swal.fire("Error", "Por favor ingrese los datos faltantes", "warning");
      return;
    }
    const newRole: PostRoleInterface = {
      name,
      description,
      entities: selectedEntities.map((entity) => entity),
    };
    console.log({ newRole });
    await addRole(newRole);
    setName(undefined);
    setDescription(undefined);
    setSelectedEntities([]);
    setIsLoading(false);
    window.location.reload();
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full ">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveRole();
            }}
          >
            <div className="mb-4 flex flex-row justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Nombre
              </label>
              <div className="relative">
                <input
                  name="name"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  type="text"
                  placeholder="Ingrese nombre del rol"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="mb-4 flex flex-row justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Descripción
              </label>
              <div className="relative">
                <input
                  name="description"
                  value={description}
                  type="text"
                  onChange={(e: any) => setDescription(e.target.value)}
                  placeholder="Ingrese descripción de rol"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="mb-4 flex flex-row justify-between" style={{height:"200px"}}>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Seleccione Entidades:
              </label>
              <div className="relative overflow-auto">
                <ul className="text-gray-900 dark:bg-gray-700 w-48 rounded-lg bg-white text-sm font-medium dark:text-white">
                  {entities.map((entity) => (
                    // <option value={entity.table_name}>{entity.table_name}</option>
                    <div
                      className="flex items-center ps-3"
                      key={entity.id}
                    >
                      <input
                        checked={selectedEntities.includes(entity.name)}
                        id={`${entity.id}`}
                        type="checkbox"
                        value={entity.name}
                        onChange={(e) => {
                          console.log("e.target.checked", e.target.checked);
                          if (e.target.checked) {
                            setSelectedEntities([
                              ...selectedEntities,
                              entity.name,
                            ]);
                          } else {
                            setSelectedEntities(
                              selectedEntities.filter(
                                (selectedEntity) =>
                                  selectedEntity !== entity.name
                              )
                            );
                          }
                        }}
                        className="bg-gray-100 border-gray-300 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 dark:bg-gray-600 dark:border-gray-500 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                      />
                      <label className="text-gray-900 dark:text-gray-300 ms-2 w-full py-3 text-sm font-medium">
                        {entity.name}
                      </label>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mb-5">
              <input
                //   onClick={handleSaveParam}
                type="submit"
                value="Guardar"
                className="block w-full border-separate rounded border bg-inherit p-3 text-center font-medium text-graydark transition hover:border-meta-3 hover:bg-meta-3 hover:bg-opacity-90 hover:text-white"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};
