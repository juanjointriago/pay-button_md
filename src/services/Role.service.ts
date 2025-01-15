import {
  ResponsePOSTRole,
  ResponseRoleInterface,
  ResponseRolesInterface,
  RoleInterface,
} from "../interfaces/roles.interface";
import API from "../pages/api/api";

export class RoleService {
  static getRoles = async (): Promise<ResponseRolesInterface> => {
    const route = "roles";
    try {
      const { data } = await API.get<ResponseRolesInterface>(route);
      return data;
    } catch (error) {
      console.log("❌Error en getRoles", error);
      return {
        msg: "Error en getRoles",
        error: true,
        records: 0,
        page: 0,
        data: [],
      };
    }
  };

  static getRoleById = async (id: number): Promise<ResponseRoleInterface> => {
    const route = `roles/${id}`;
    try {
      const { data } = await API.get<ResponseRoleInterface>(route);
      return data;
    } catch (error) {
      console.log("❌Error en getRole", error);
      return {
        msg: "Error en getRole",
        error: true,
        records: 0,
        data: null,
      };
    }
  };

  static postRole = async (role:RoleInterface): Promise<ResponsePOSTRole> => {
    const route = "roles";
    try {
      const { data } = await API.post<ResponsePOSTRole>(route,role);
      return data;
    } catch (error) {
      console.log("❌Error en postRole", error);
      return {
        msg: "Error en postRole",
        newRole: null,
      };
    }
  };

  static putRole = async (id:number, role:RoleInterface): Promise<ResponsePOSTRole> => {
    const route = `roles/${id}`;
    try {
      const { data } = await API.put<ResponsePOSTRole>(route,role);
      return data;
    } catch (error) {
      console.log("❌Error en putRole", error);
      return {
        msg: "Error en putRole",
        newRole: null,
      };
    }
  };

  static deleteRole = async (id:number): Promise<ResponsePOSTRole> => {
    const route = `roles/${id}`;
    try {
      const { data } = await API.delete<ResponsePOSTRole>(route);
      return data;
    } catch (error) {
      console.log("❌Error en deleteRole", error);
      return {
        msg: "Error en deleteRole",
        newRole: null,
      };
    }
  };
}
