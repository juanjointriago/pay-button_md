import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import { LoginData, LoginInterface } from "../../interfaces/auth.interface";
import { AuthService } from "../../services/Auth.service";
import { useParamStore } from "../params/params.store";
import { useUserStore } from "../users/users.store";
import { useProfileStore } from "../profile/profile.store";
import { useRoleStore } from "../roles/roles.store";

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
> = (set) => ({
  status: "unauthorized",
  user: undefined,
  token: null,
  errorMsg: undefined,
  setErrorMsg: (msg) => set({ errorMsg: msg }),
  signInUser: async ({ username, password }) => {
    try {
      const { data } = await AuthService.login({
        username,
        password,
      });
      localStorage.setItem("token", data.token);
      set({ status: "authorized", user: data.data, token: data.token });
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
      }
      return error;
    }
  },
  checkAuthStatus: async () => {
    try {
      const { data } = await AuthService.checkAuthStatus();
      set({ status: data.msg });
      return data.msg === "Authenticated" ? "authorized" : "unauthorized";
    } catch (error) {
      set({ status: "unauthorized" });
      console.log("❌Error en checkAuthStatus", error);
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
