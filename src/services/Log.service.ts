import { ReponseLogsInterface } from "../interfaces/logs.interface";
import API from "../pages/api/api";

export class LogService {
  static getLogs = async (): Promise<ReponseLogsInterface> => {
    const route = "logs?pageSize=999999";
    // try {
        // const token = localStorage.getItem("token");
      //   if(!token){
      // console.log("❌Error en getLogs NO HAY TOKEN");
      //       return};
      const { data } = await API.get<ReponseLogsInterface>(route) ;
      return data;
    // } catch (error) {
    //   console.log("❌Error en getLogs", error);
    //   return {
    //     msg: "Error en getLogs",
    //     error: true,
    //     records: 0,
    //     page: 0,
    //     data: [],
    //   };
    // }
  };
}
