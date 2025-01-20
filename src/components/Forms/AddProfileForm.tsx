import { useState } from "react";
import { useProfileStore } from "../../stores/profile/profile.store";
import Swal from "sweetalert2";
import Loader from "../../common/Loader";
import { useRoleStore } from "../../stores/roles/roles.store";
import Select from "react-tailwindcss-select";
import { Options } from "react-tailwindcss-select/dist/components/type";

export const AddProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const addProfile = useProfileStore((state) => state.addProfile);
  const roles = useRoleStore((state) => state.roles);
  const optionRoles: Options = roles.map((rol) => {
    return { value: `${rol.id}`, label: rol.description };
  });
  const [roleIds, setRoleIds] = useState(null);
  const handleSaveProfile = async () => {
    setIsLoading(true);
    if (!name && !description && !roleIds) {
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

  console.log("Roles", roleIds);
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
            <div className="mb-4 flex flex-row justify-between">
              <Select
                placeholder="Escoja Roles para el perfil"
                isMultiple
                noOptionsMessage="No hay opciones disponibles"
                primaryColor={"indigo"}
                value={roleIds}
                onChange={setRoleIds}
                options={optionRoles}
              />
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
