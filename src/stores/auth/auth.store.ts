import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import { LoginData, LoginInterface } from "../../interfaces/auth.interface";
import { AuthService } from "../../services/Auth.service";
import { useParamStore } from "../params/params.store";
import { useUserStore } from "../users/users.store";
import { useProfileStore } from "../profile/profile.store";
import { useRoleStore } from "../roles/roles.store";
import Swal from "sweetalert2";

type authStatus = "authorized" | "unauthorized" | "checking";
export interface AuthState {
  status: authStatus;
  user?: LoginData;
  errorMsg?: string;
  token: string | null;
  setErrorMsg: (msg: string) => void;
  signInUser: (user: LoginInterface) => Promise<void>;
  checkAuthStatus: () => Promise<authStatus>;
  logoutUser: () => void;
}

export const storeAPI: StateCreator<
  AuthState,
  [["zustand/devtools", never], ["zustand/immer", never]]
> = (set, get) => ({
  status: "unauthorized",
  user: undefined,
  token: null,
  errorMsg: "",
  setErrorMsg: (msg) => set({ errorMsg: msg }),
  signInUser: async ({ username, password }) => {
    set({ errorMsg: "" });
    try {
      const { data, token } = await AuthService.login({
        username,
        password,
      });
      console.log("✅LOGIN RESULT", { data });
      localStorage.setItem("token", token);
      set({ status: "authorized", user: data, token });
      return data;
    } catch (error) {
      set({ errorMsg: "" });
      console.log("❌Error en Login", error);
      const { data } = error.response;
      console.log("data.msg", { data: data.msg });
      if (error) {
        const text =
          data.msg == "User not found"
            ? "Credenciales incorrectas"
            : "Error en login";
        set({ errorMsg: text });
        Swal.fire({
          icon: "error",
          title: "Error",
          text: get().errorMsg,
          confirmButtonColor: "blue",
          confirmButtonText: "Aceptar",
        });
      }
      return error;
    }
  },
/**
 * Checks the authentication status of the user.
 * 
 * Makes a request to the `AuthService` to determine if the user is authorized.
 * Updates the store's status based on the authentication response.
 * 
 * @returns A promise that resolves to "authorized" if the user is authenticated,
 *          otherwise "unauthorized".
 * @throws Logs any errors encountered during the authentication check.
 */

  checkAuthStatus: async () => {
    try {
      const statusAuth = await AuthService.checkAuthStatus();
      // console.log("✅ checkAuthStatus => ", { statusAuth });
      set({ status: statusAuth });
      if (statusAuth && statusAuth === "authorized") return "authorized";
    } catch (error) {
      console.log("token",localStorage.getItem("token"))
      // if (localStorage.getItem("token")) {
      //   localStorage.removeItem("token");
      // }
      // window.location.href = "/auth/signin";
      // console.log("❌Error en checkAuthStatus", { error });
      return "unauthorized";
    }
  },
  logoutUser: () => {
    AuthService.logout();
    set({
      status: "unauthorized",
      user: undefined,
      token: null,
    });
    useAuthStore.persist.clearStorage();
    useParamStore.persist.clearStorage();
    useProfileStore.persist.clearStorage();
    useRoleStore.persist.clearStorage();
    useUserStore.persist.clearStorage();
    window.location.href = "/auth/signin";
  },
});

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(immer(storeAPI), {
      name: "auth-store",
    })
  )
);
