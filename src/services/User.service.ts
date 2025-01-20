import {
  AddUserInterface,
  ReponsePostUserInterface,
  ResponseUserInterface,
  ResponseUsersInterface,
  UpdatedUser,
  UserInterface,
} from "../interfaces/user.interface";
import API from "../pages/api/api";

export class UserService {
  static getUsers = async (): Promise<ResponseUsersInterface> => {
    const route = "users";
    try {
      const { data } = await API.get<ResponseUsersInterface>(route);
      return data;
    } catch (error) {
      console.log("❌Error en getUsers", error);
      return {
        msg: "Error en getUsers",
        error: true,
        records: 0,
        page: 0,
        data: [],
      };
    }
  };

  static getUserById = async (id: number): Promise<UserInterface> => {
    const route = `users/${id}`;
    try {
      const { data } = await API.get<ResponseUserInterface>(route);
      return data.data;
    } catch (error) {
      console.log("❌Error en getUser", error);
      return {} as UserInterface;
    }
  };

  static postUser = async (user: AddUserInterface) => {
    // console.log("💩 INFO adding user data =>", user);
    const route = "users";
    // try {
      const response= await API.post<ReponsePostUserInterface>(route, user);
      return response
    // } catch (error) {
    //   console.log("❌Error en postUser", error);
    //   console.log("noooooooooo");
    //   // return {
    //   //     msg: "Error en postUser",
    //   //     error: true,
    //   //     records: 0,
    //   //     data: null,
    //   // };
    // }
  };
  static putUser = async (
    id: number,
    user: any
  ): Promise<ResponseUserInterface> => {
    const route = `users/${id}`;
    try {
        console.log("DATA TO UPDATE", user);
      const { data } = await API.put<ResponseUserInterface>(route, user);
      console.log("RESPONSE PUT", data);
      return data;
    } catch (error) {
      console.log("❌Error en putUser", error);
      return {
        msg: "Error en putUser",
        error: true,
        records: 0,
        data: null,
      };
    }
  };
  static deleteUser = async (id: number): Promise<ResponseUserInterface> => {
    const route = `users/${id}`;
    try {
      const { data } = await API.delete<ResponseUserInterface>(route);
      return data;
    } catch (error) {
      console.log("❌Error en deleteUser", error);
      return {
        msg: "Error en deleteUser",
        error: true,
        records: 0,
        data: null,
      };
    }
  };
}
