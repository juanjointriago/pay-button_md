import { FC, useEffect, useState } from "react";
import { useProfileStore } from "../../stores/profile/profile.store";
import Swal from "sweetalert2";
import { ProfileAddInterface, ProfileInterface } from "../../interfaces/profiles.interface";
import Loader from "../../common/Loader";

interface Props {
  id: number;
}
export const EditProfileForm: FC<Props> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [profile, setProfile] = useState<ProfileInterface>(
    {} as ProfileInterface
  );
  console.log(profile)
  const selecteProfile = useProfileStore((state) => state.getSelectedProfile());
  const [infoMessage, setinfoMessage] = useState("");
  console.log(infoMessage)

  const editProfile = useProfileStore((state) => state.editProfile);

  useEffect(() => {
    setProfile({...selecteProfile});
    setName(selecteProfile.name);
    setDescription(selecteProfile.description);
    setinfoMessage("");
  }, [selecteProfile]);

  const handleEditProfile = async () => {
    setIsLoading(true);
    try {
      await editProfile(id, { name, description } as ProfileAddInterface);
    } catch (error) {
      Swal.fire("Error", `${error}`, "error");
    }
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
              handleEditProfile();
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
                Descripcion
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
