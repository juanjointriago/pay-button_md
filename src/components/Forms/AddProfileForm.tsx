import { useState } from "react";
import { useProfileStore } from "../../stores/profile/profile.store";
import Swal from "sweetalert2";
import Loader from "../../common/Loader";
import { useRoleStore } from "../../stores/roles/roles.store";

export const AddProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const addProfile = useProfileStore((state) => state.addProfile);
  const roles = useRoleStore((state) => state.roles);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    if (!name && !description && !!!selectedRoles) {
      Swal.fire("Error", "Por favor ingrese los datos faltantes", "warning");
    }
    try {
      await addProfile({ name, description });
    } catch (error) {
      Swal.fire("Error", `${error}`, "error");
    }
    setIsLoading(false);
    // window.location.reload();
  };

  console.log("Roles", selectedRoles);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full ">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProfile();
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
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Ingrese nombre de perfil"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="mb-4 flex flex-row justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Valor
              </label>
              <div className="relative">
                <input
                  name="description"
                  value={description}
                  type="text"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ingrese descripción de perfil"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
              <div
                className="mb-4 flex flex-row justify-between"
                style={{ height: "200px" }}
              >
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Roles:
                </label>
                <div className="relative overflow-auto">
                  <ul className="text-gray-900 dark:bg-gray-700 w-48 rounded-lg bg-white text-sm font-medium dark:text-white">
                    {roles.map((role) => (
                      // <option value={role.table_name}>{role.table_name}</option>
                      <div className="flex items-center ps-3" key={role.id}>
                        <input
                          checked={selectedRoles.includes(role.id)}
                          id={`${role.id}`}
                          type="checkbox"
                          value={role.name}
                          onChange={(e) => {
                            console.log("e.target.checked", e.target.checked);
                            if (e.target.checked) {
                              setSelectedRoles([...selectedRoles, role.id]);
                            } else {
                              setSelectedRoles(
                                selectedRoles.filter(
                                  (selectedEntity) => selectedEntity !== role.id
                                )
                              );
                            }
                          }}
                          className="bg-gray-100 border-gray-300 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 dark:bg-gray-600 dark:border-gray-500 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                        />
                        <label className="text-gray-900 dark:text-gray-300 ms-2 w-full py-3 text-sm font-medium">
                          {`${role.name}: ${role.description} [${
                            role.entities?.map((e) => e).join(", ") ?? ""
                          }]`}
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
