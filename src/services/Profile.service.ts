import { ReponseProfileInterface, ResponseProfilesInterface } from "../interfaces/profiles.interface";
import API from "../pages/api/api";

export class ProfileService {
    static getProfiles = async (): Promise<ResponseProfilesInterface> => {
        const route = "profiles";
        try {
            const { data } = await API.get<ResponseProfilesInterface>(route);
            return data;
        } catch (error) {
            console.log("❌Error en getProfiles", error);
            return {
                msg: "Error en getProfiles",
                error: true,
                records: 0,
                data: [],
            };
        }
    }

    static  getProfileById = async (id: number): Promise<ResponseProfilesInterface> => {
        const route = `profiles/${id}`;
        try {
            const { data } = await API.get<ResponseProfilesInterface>(route);
            return data;
        } catch (error) {
            console.log("❌Error en getProfile", error);
            return {
                msg: "Error en getProfile",
                error: true,
                records: 0,
                data: [],
            };
        }
    }

    static postProfile = async (profile: any): Promise<ReponseProfileInterface> => {
        const route = "profiles";
        try {
            const { data } = await API.post<ReponseProfileInterface>(route, profile);
            return data;
        } catch (error) {
            console.log("❌Error en postProfile", error);
            return {
                msg: "Error en postProfile",
                error: true,
                records: 0,
                data: undefined,
            };
        }
    }

    static putProfile = async (id: number, profile: any): Promise<ResponseProfilesInterface> => {
        const route = `profiles/${id}`;
        try {
            const { data } = await API.put<ResponseProfilesInterface>(route, profile);
            return data;
        } catch (error) {
            console.log("❌Error en putProfile", error);
            return {
                msg: "Error en putProfile",
                error: true,
                records: 0,
                data: [],
            };
        }
    }

    static deleteProfile = async (id: number): Promise<ResponseProfilesInterface> => {
        const route = `profiles/${id}`;
        try {
            const { data } = await API.delete<ResponseProfilesInterface>(route);
            return data;
        } catch (error) {
            console.log("❌Error en deleteProfile", error);
            return {
                msg: "Error en deleteProfile",
                error: true,
                records: 0,
                data: [],
            };
        }
    }
}