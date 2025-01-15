import {
  ResponseActiveAudit,
  ResponseEntitiesInterface,
} from "../interfaces/entities.interface";
import API from "../pages/api/api";

export class EntitiesService {
  static getEntities = async (): Promise<ResponseEntitiesInterface> => {
    const route = "audit/getEntities";
    try {
      // const token = localStorage.getItem("token");
      // if (!token) {
      //   console.log("❌Error en getLogs NO HAY TOKEN");
      //   return;
      // }
      const { data } = await API.get<ResponseEntitiesInterface>(route);
      return data;
    } catch (error) {
      console.log("❌Error en getEntities", error);
      return {
        msg: "Error en getEntities",
        error: true,
        data: [],
      };
    }
  };
  static activeAudit = async (entity: string): Promise<ResponseActiveAudit> => {
    const route = `audit/active-audit`;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("❌Error en activeAudit NO HAY TOKEN");
        return;
      }
      const { data } = await API.post<ResponseActiveAudit>(route, { entity });
      return data;
    } catch (error) {
      console.log("❌Error en activeEntity", error);
      return {
        msg: error.message,
      };
    }
  };
  static inactiveAudit = async (
    entity: string
  ): Promise<ResponseActiveAudit> => {
    const route = `audit/inactive-audit`;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("❌Error en inactiveAudit NO HAY TOKEN");
        return;
      }
      const { data } = await API.post<ResponseActiveAudit>(route, { entity });
      return data;
    } catch (error) {
      console.log("❌Error en inactiveAudit", error);
      return {
        msg: "Error en inactiveAudit",
      };
    }
  };
}
