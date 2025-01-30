import {
  LoginInterface,
  ResponseLoginInterface,
} from "../interfaces/auth.interface";
import API from "../pages/api/api";

export class AuthService {
  static login = async ({
    username,
    password,
  }: LoginInterface) => {
    const route = "auth/login";
    return await API.post<ResponseLoginInterface>(route, {
      username,
      password,
    });
  };

  static checkAuthStatus = async () => {
    return await API.get("auth/checkAuthStatus");
    // return await API.get("auth/checkAuthStatus", {
    //   headers: {
    //     "auth-token": localStorage.getItem("token") || "",
    //   },
    // });

  };

  static logout = () => {
    localStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/signin";
  };

  static forgotPassword = async (username: string) => {
    const route = "auth/forgotPassword";
    return await API.post(route, { username });

  };

  static resetPassword = async (username: string) => {
    const route = "auth/resetPassword";
    return await API.post(route, { username });

  };
}
