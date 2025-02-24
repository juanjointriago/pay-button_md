import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import { LoginData, LoginInterface } from "../../interfaces/auth.interface";
import { AuthService } from "../../services/Auth.service";
import { useParamStore } from "../params/params.store";
import { useUserStore } from "../users/users.store";
import { useProfileStore } from "../profile/profile.store";
import { useRoleStore } from "../roles/roles.store";
import { to } from "../../utils/to";

type authStatus = "authorized" | "unauthorized" | "checking";
export interface AuthState {
  status: authStatus;
  user?: LoginData;
  showLoginModal?: boolean;
  errorMsg?: string;
  token: string | null;
  setErrorMsg: (msg: string) => void;
  signInUser: (user: LoginInterface) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  logoutUser: () => void;
}

export const storeAPI: StateCreator<
  AuthState,
  [["zustand/devtools", never], ["zustand/immer", never]]
> = (set, get) => ({
  status: "checking",
  user: undefined,
  token: null,
  errorMsg: undefined,
  setErrorMsg: (msg) => set({ errorMsg: msg }),
  signInUser: async ({ username, password }) => {
    set({ errorMsg: undefined });
    const [error, response] = await to(AuthService.login({ username, password }));

    if (error) {
      const msg = (error as any)?.response?.data?.msg ?? "Error en login";
      set({ errorMsg: msg, showLoginModal: true });
      return;
    }

    localStorage.setItem('token', (response as any).data.token);

    set({ status: "authorized", user: (response as any).data.data, token: (response as any).data.token, showLoginModal: false });

    // try {
    //   const { data } = await AuthService.login({ username, password });
    //   localStorage.setItem("token", data.token);
    //   set({ status: "authorized", user: data.data, token: data.token });
    //   return data;
    // } catch (error) {
    //   set({ errorMsg: undefined });
    //   console.log("❌Error en Login", error);
    //   const { data } = error.response;
    //   console.log("data.msg", { data: data.msg });
    //   if (error) {
    //     // const text =
    //     //   data.msg == "User not found"
    //     //     ? "Credenciales incorrectas"
    //     //     : "Error en login";
    //     set({ errorMsg: 'Error en login' });
    //   }
    //   return error;
    // }
  },
  checkAuthStatus: async () => {
    const [error, response] = await to(AuthService.checkAuthStatus());
    if (error) return set({ status: "unauthorized" });

    // console.log({ response: (response as any).data.user });
    const oldUser = get().user;
    // console.log({ oldUser });

    // debugger;
    set({ status: (response as any).msg, user: { ...oldUser, ...(response as any).data.user } });

    // set({ status: (response as any).msg, user: { ...oldUser, ...(response as any).data.user } });

    // set(oldState => ({ ...oldState, status: (response as any).msg, user: { ...oldState.user, ...(response as any).data.user } }));
    // return response.msg === "Authenticated" ? "authorized" : "unauthorized";
    // try {
    //   const { data } = await AuthService.checkAuthStatus();
    //   console.log({ data });

    //   set({ status: data.msg });
    //   return data.msg === "Authenticated" ? "authorized" : "unauthorized";
    // } catch (error) {
    //   set({ status: "unauthorized" });
    //   console.log("❌Error en checkAuthStatus", error);
    //   return "unauthorized";
    // }
  },
  logoutUser: () => {
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
    AuthService.logout();
    // window.location.href = "/auth/signin";
  },
});

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(immer(storeAPI), {
      name: "auth-store",
    })
  )
);
