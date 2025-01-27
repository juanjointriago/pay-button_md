import {
  PostRoleInterface,
  ResponsePOSTRole,
  ResponsePutRoleInterface,
  ResponseRoleInterface,
  ResponseRolesInterface,
  RoleInterface,
} from "../interfaces/roles.interface";
import API from "../pages/api/api";

export class RoleService {
  static getRoles = async () => {
    const route = "roles";
    const response = await API.get<ResponseRolesInterface>(route);
    return response;
  };

  static getRoleById = async (id: number) => {
    const route = `roles/${id}`;
    const response = await API.get<ResponseRoleInterface>(route);
    return response;
  };

  static postRole = async (role: PostRoleInterface) => {
    const route = "roles";
    const response = await API.post<ResponsePOSTRole>(route, role);
    return response;
  };

  static putRole = async (id: number, role: RoleInterface) => {
    const route = `roles/${id}`;
    const response = await API.put<ResponsePutRoleInterface>(route, role);
    return response;
  };

  static deleteRole = async (id: number) => {
    const route = `roles/${id}`;
    const response = await API.delete<ResponsePOSTRole>(route);
    return response;
  };
}
