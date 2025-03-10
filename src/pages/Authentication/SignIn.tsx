import { FC, useState } from "react";
import { Link } from "react-router-dom";
import LogoDark from "../../images/logo/logo-m-duran.jpg";
import Logo from "../../images/logo/logo-m-duran.jpg";
// import Swal from "sweetalert2";
import Loader from "../../common/Loader";
import { useAuthStore } from "../../stores/auth/auth.store";
import { FaIdCard, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

type LoginData = z.infer<typeof LoginSchema>;

const SignIn: FC = () => {
  const signin = useAuthStore((state) => state.signInUser);
  // const showLoginModal = useAuthStore((state) => state.showLoginModal);
  // const errorMsg = useAuthStore((state) => state.errorMsg);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginData>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const login = async (formValues: LoginData) => {
    setIsLoading(true);
    // if (!userName && !password) {
    //   Swal.fire("Error", "Por favor ingrese su usuario y contraseña", "error");
    // }

    await signin({ username: formValues.username, password: formValues.password });

    // if (!errorMsg) {
    //   setIsLoading(false);
    //   return;
    // }

    // if (!!errorMsg) await Swal.fire({
    //   icon: "error",
    //   title: "Error",
    //   text: errorMsg,
    //   confirmButtonColor: "blue",
    //   confirmButtonText: "Aceptar",
    // });

    setIsLoading(false);
  };


  // useEffect(() => {
  //   if (!errorMsg || !showLoginModal) return;

  //   Swal.fire({
  //     icon: "error",
  //     title: "Error",
  //     text: errorMsg,
  //     confirmButtonColor: "blue",
  //     confirmButtonText: "Aceptar",
  //   });
  // }, [errorMsg]);

  return (
    <div style={{ padding: "50px" }}>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-wrap items-center">
            <div className="hidden w-full xl:block xl:w-1/2">
              <div className="px-26 py-17.5 text-center">
                <Link className="mb-5.5 inline-block" to="/">
                  <img className="hidden dark:block" src={Logo} alt="Logo" />
                  <img className="dark:hidden" src={LogoDark} alt="Logo" />
                </Link>
                <p className="2xl:px-20">
                  Plataforma para recaudación de predios municipales
                </p>
              </div>
            </div>
            <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
              <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                  Inicie Sesión
                </h2>
                <form
                  onSubmit={form.handleSubmit(login)}
                >
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Nro de Cédula
                    </label>
                    <div className="relative">
                      <input
                        // value={userName}
                        // onChange={(e) => setUserName(e.target.value)}
                        type="text"
                        placeholder="Ej. 1002003004"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        {...form.register("username")}
                      />
                      {
                        form.formState.errors.username && (
                          <span className="text-rose-500">
                            {form.formState.errors.username.message}
                          </span>
                        )
                      }
                      <span className="absolute right-4 top-4">
                        <FaIdCard size={22} />
                      </span>
                    </div>
                  </div>


                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Ingrese su Contraseña
                    </label>
                    <div className="relative">
                      <input
                        // value={password}
                        type="password"
                        // onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        {...form.register("password")}
                      />
                      {
                        form.formState.errors.password && (
                          <span className="text-rose-500">
                            {form.formState.errors.password.message}
                          </span>
                        )
                      }
                      <span className="absolute right-4 top-4">
                        <FaLock size={22} />
                      </span>
                    </div>
                  </div>
                  <div className="mb-5">
                    <input
                      // onClick={login}
                      type="submit"
                      value="Continuar ➡️"
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    />

                    {/* <NavLink to="/auth/signup">
                      <span className="text-sm mt-2 hover:underline inline-block hover:cursor-pointer text-gray-500 hover:text-graydark">
                        No tienes cuenta? Regístrate
                      </span>
                    </NavLink> */}

                    <div className="mt-2 text-center">
                      <p>
                        No tienes una cuenta?{" "}
                        <Link
                          to="/auth/signup"
                          className="text-primary hover:underline"
                        >
                          Regístrate
                        </Link>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SignIn;
