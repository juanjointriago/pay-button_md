import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import { LoginData, LoginInterface } from "../../interfaces/auth.interface";
import { AuthService } from "../../services/Auth.service";
import { useLogsStore } from "../logs/log.store";
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
      confirmButtonText: "Aceptar",});
      }
      return error;
    }
  },
  checkAuthStatus: async () => {
    const status = await AuthService.checkAuthStatus();
    set({ status });
    return status;
  },
  logoutUser: () => {
    AuthService.logout();
    set({
      status: "unauthorized",
      user: undefined,
      token: null,
    });
    useAuthStore.persist.clearStorage();
    useLogsStore.persist.clearStorage();
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
