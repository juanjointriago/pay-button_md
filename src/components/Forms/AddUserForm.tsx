import { useEffect, useState } from "react";
import { useUserStore } from "../../stores/users/users.store";
import Loader from "../../common/Loader";
import { useProfileStore } from "../../stores/profile/profile.store";
import { useRoleStore } from "../../stores/roles/roles.store";
import { Message } from "../Texts/Message";

export const AddUserForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const addUser = useUserStore((state) => state.addUser);
  const getProfiles = useProfileStore((state) => state.getProfiles);
  const getRoles = useRoleStore((state) => state.getRoles);
  const profiles = useProfileStore((state) => state.profiles);
  const roles = useRoleStore((state) => state.roles);
  const getUsers = useUserStore((state) => state.getUsers);
  const users = useUserStore((state) => state.users);
  const [errorMessage, setErrorMessage] = useState("");

  const [roleId, setRoleId] = useState(0);
  const [profileId, setProfileId] = useState<number>(0);

  useEffect(() => {
    getUsers();
    getProfiles();
    getRoles();
  }, []);

  const handleProfileChange = (value: number) => {
    setProfileId(value);
  };
  const handleRoleChange = (value: number) => {
    setRoleId(value);
  };
  const validateSameData = () => {
    const uniqueEmail = users.find((user) => user.email === email);
    const uniqueUserName = users.find((user) => user.username === username);
    if (uniqueEmail) {
      setErrorMessage("El email ya se encuentra registrado");
      return false;
    }
    if (uniqueUserName) {
      setErrorMessage("El nombre de usuario ya se encuentra registrado");
      return false;
    }
    return true;
  };
  const handleSaveUser = async () => {
    if(username === "" || password === "" || email === "" || roleId === 0 || profileId === 0){
      setErrorMessage("Por favor complete todos los campos");
      return;
    }
    setIsLoading(true);
    if (!validateSameData()) {
      setIsLoading(false);
      return;
    }
    await addUser({ username, password, email, roleId, profileId });
    setUsername("");
    setPassword("");
    setEmail("");
    setRoleId(0);
    setProfileId(0);
    setErrorMessage("Usuario creado exitosamente");
    setIsLoading(false);

    console.log("EXITO");

    // window.location.reload();
    window.location.href = window.location.href;
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full ">
          {errorMessage && <Message title="Info" message={errorMessage} />}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveUser();
            }}
          >
            <div className="mb-4 flex flex-row justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Nombre de Usuario
              </label>
              <div className="relative">
                <input
                  name="username}"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Ingrese nombre de usuario"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="mb-4 flex flex-row justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Contraseña
              </label>
              <div className="relative">
                <input
                  name="password"
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese contrasena"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="mb-4 flex flex-row justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Email
              </label>
              <div className="relative">
                <input
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Ingrese email"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="mb-4 flex flex-row justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Perfil
              </label>
              <div className="relative">
                <div className="mb-5.5">
                  <label
                    htmlFor="recommend"
                    className="mb-4.5 block text-sm font-medium text-black dark:text-white"
                  >
                    Seleccione el perfil que desea asignar
                  </label>

                  <div className="flex flex-col gap-2.5">
                    {profiles.map((option) => (
                      <div key={option.id}>
                        <label className="relative flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-black dark:text-white">
                          <input
                            className="sr-only"
                            type="radio"
                            name="profileId"
                            id={`${option.id}`}
                            onChange={() => handleProfileChange(option.id)}
                          />
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              profileId === option.id
                                ? "border-primary"
                                : "border-body"
                            }`}
                          >
                            <span
                              className={`h-2.5 w-2.5 rounded-full bg-primary ${
                                profileId === option.id ? "flex" : "hidden"
                              }`}
                            ></span>
                          </span>
                          {option.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4 flex flex-row justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Rol
              </label>
              <div className="relative">
                <div className="mb-5.5">
                  <label
                    htmlFor="recommend"
                    className="mb-4.5 block text-sm font-medium text-black dark:text-white"
                  >
                    Seleccione el Rol que desea asignar
                  </label>

                  <div className="flex flex-col gap-2.5">
                    {roles.map((option) => (
                      <div key={option.id}>
                        <label className="relative flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-black dark:text-white">
                          <input
                            className="sr-only"
                            type="radio"
                            name="roleId"
                            id={`${option.id}`}
                            onChange={() => handleRoleChange(option.id)}
                          />
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              roleId === option.id
                                ? "border-primary"
                                : "border-body"
                            }`}
                          >
                            <span
                              className={`h-2.5 w-2.5 rounded-full bg-primary ${
                                roleId === option.id ? "flex" : "hidden"
                              }`}
                            ></span>
                          </span>
                          {option.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
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
