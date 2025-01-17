import {
  LoginInterface,
  ResponseLoginInterface,
} from "../interfaces/auth.interface";
import API from "../pages/api/api";

export class AuthService {
  static login = async ({
    username,
    password,
  }: LoginInterface): Promise<ResponseLoginInterface | undefined> => {
    const route = "auth/login";
    const auth = await API.post<ResponseLoginInterface>(route, {
      username,
      password,
    });
    return auth.data;
  };

  static checkAuthStatus = async () => {
    // try {
      const { data } = await API.get("auth/checkAuthStatus");
      console.log("✅ checkAuthStatus => ", { data });
      if (data && data.msg === "Authenticated") return "authorized";
      console.log("❌Error en checkAuthStatus");
      return "unauthorized";
  
  };

  static logout = () => {
    localStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  static forgotPassword = async (username: string) => {
    const route = "auth/forgotPassword";
    try {
      const { data } = await API.post(route, { username });

      console.log("✅forgotPassword RESULT", { data });
      if (data.error) return undefined;
      return data;
    } catch (error) {
      console.log("❌Error en forgotPassword", error);
      return undefined;
    }
  };

  static resetPassword = async (username: string) => {
    const route = "auth/resetPassword";
    try {
      const { data } = await API.post(route, { username });

      console.log("✅resetPassword RESULT", { data });
      if (data.error) return undefined;
      return data;
    } catch (error) {
      console.log("❌Error en resetPassword", error);
      return undefined;
    }
  };
}
