import {
  AddUserInterface,
  ReponsePostUserInterface,
  ResponseUserInterface,
  ResponseUsersInterface,
} from "../interfaces/user.interface";
import API from "../pages/api/api";

export class UserService {
  static getUsers = async () => {
    const route = "users";
    return await API.get<ResponseUsersInterface>(route);
  };

  static getUserById = async (id: number) => {
    const route = `users/${id}`;
    return await API.get<ResponseUserInterface>(route);
  };

  static postUser = async (user: AddUserInterface) => {
    const route = "users";
    const reponse= await API.post<ReponsePostUserInterface>(route, user);
    return reponse;
  };
  static putUser = async (id: number, user: any) => {
    const route = `users/${id}`;
    return await API.put<ResponseUserInterface>(route, user);
  };
  static deleteUser = async (id: number) => {
    const route = `users/${id}`;
    return await API.delete<ResponseUserInterface>(route);
  };
}
