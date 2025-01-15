import { ParamInterface, ResponseParamInterface, ResponseParamsInterface, ResponsePostParam, ResponsePUTParam } from "../interfaces/params.interface";
import API from "../pages/api/api";

export class ParamsService {
    static getParams = async (): Promise<ResponseParamsInterface> => {
        const route = "params";
        try {
            const { data } = await API.get<ResponseParamsInterface>(route);
            return data;
        } catch (error) {
            console.log("❌Error en getParams", error);
            return {
                msg: "Error en getParams",
                error: true,
                records: 0,
                data: [],
            };
        }
    }


    static getParamById = async (id: number): Promise<ResponseParamInterface> => {
        const route = `params/${id}`;
        try {
            const { data } = await API.get<ResponseParamInterface>(route);
            return data;
        } catch (error) {
            console.log("❌Error en getParam", error);
            return {
                msg: "Error en getParam",
                error: true,
                records: 0,
                data: null,
            };
        }
    }


    static postParam = async (param:ParamInterface): Promise<ResponsePostParam> => {
        const route = "params";
        try {
            const { data } = await API.post<ResponsePostParam>(route, param );
            return data;
        } catch (error) {
            console.log("❌Error en postParam", error);
            return {
                msg: "Error en postParam",
                newParam: null,
            };
        }
    }


    static putParam = async (id: number, param:ParamInterface): Promise<ResponsePUTParam> => {
        const route = `params/${id}`;
        try {
            const { data } = await API.put<ResponsePUTParam>(route, param );
            return data;
        } catch (error) {
            console.log("❌Error en putParam", error);
            return {
                msg: "Error en putParam",
                error: null,
                records: 0,
            };
        }
    }


    static deleteParam = async (id: number): Promise<ResponseParamsInterface> => {  
        const route = `params/${id}`;
        try {
            const { data } = await API.delete<ResponseParamsInterface>(route);
            return data;
        } catch (error) {
            console.log("❌Error en deleteParam", error);
            return {
                msg: "Error en deleteParam",
                error: true,
                records: 0,
                data: [],
            };
        }
    }


}