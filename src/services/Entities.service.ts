import { ReponseEntitiesInterface } from "../interfaces/entities.interface";
import API from "../pages/api/api";

export class EntitiesService {
    static getEntities = async()=> {
        const route = "entity";
        const { data } = await API.get<ReponseEntitiesInterface>(route);
        return data;
    }
}