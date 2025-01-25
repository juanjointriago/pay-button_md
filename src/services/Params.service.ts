import { ParamInterface, ResponseParamInterface, ResponseParamsInterface, ResponsePostParam, ResponsePUTParam } from "../interfaces/params.interface";
import API from "../pages/api/api";

export class ParamsService {
    static getParams = async () => {
        const route = "params";
            return await API.get<ResponseParamsInterface>(route);
    }


    static getParamById = async (id: number) => {
        const route = `params/${id}`;
            return await API.get<ResponseParamInterface>(route);
    }


    static postParam = async (param:ParamInterface) => {
        const route = "params";
            return await API.post<ResponsePostParam>(route, param );
    }


    static putParam = async (id: number, param:ParamInterface)=> {
        const route = `params/${id}`;
            return await API.put<ResponsePUTParam>(route, param );
        
    }


    static deleteParam = async (id: number)=> {  
        const route = `params/${id}`;
            return await API.delete<ResponseParamsInterface>(route);
    }


}