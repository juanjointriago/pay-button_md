import { ReponseProfileInterface, ResponseProfilesInterface } from "../interfaces/profiles.interface";
import API from "../pages/api/api";

export class ProfileService {
    static getProfiles = async () => {
      const route = "profiles";
      return await API.get<ResponseProfilesInterface>(route);
    };
  
    static getProfileById = async (id: number) => {
      const route = `profiles/${id}`;
      return await API.get<ResponseProfilesInterface>(route);
    };
  
    static postProfile = async (profile: any) => {
      const route = "profiles";
      return await API.post<ReponseProfileInterface>(route, profile);
    };
  
    static putProfile = async (id: number, profile: any) => {
      const route = `profiles/${id}`;
      return await API.put<ResponseProfilesInterface>(route, profile);
    };
  
    static deleteProfile = async (id: number) => {
      const route = `profiles/${id}`;
      return await API.delete<ResponseProfilesInterface>(route);
    };
  }
  