import { create, StateCreator } from "zustand";
import {
  ProfileAddInterface,
  ProfileInterface,
} from "../../interfaces/profiles.interface";
import { ProfileService } from "../../services/Profile.service";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { AuthService } from "../../services/Auth.service";

export interface ProfileStore {
  profiles: ProfileInterface[];
  getProfiles: () => Promise<void>;
  addProfile: (profile: ProfileAddInterface) => Promise<void>;
  editProfile: (id: number, profile: ProfileAddInterface) => Promise<void>;
  selectedProfile: ProfileInterface;
  getSelectedProfile: () => ProfileInterface;
  getProfileById: (id: number) => ProfileInterface;
  setSelectedProfileById: (id: number) => void;
  deleteProfile: (id: number) => Promise<void>;
}

const profilesAPI: StateCreator<
  ProfileStore,
  [["zustand/devtools", never], ["zustand/immer", never]]
> = (set, get) => ({
  profiles: [],
  selectedProfile: {} as ProfileInterface,
  getProfiles: async () => {
    try {
      const response = await ProfileService.getProfiles();
      set({ profiles: response.data.data });
    } catch (error) {
      console.log("❌Error en getProfiles", error);
      set({ profiles: [] });
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
  addProfile: async (profile) => {
    try {
      const { data: newProfile } = await ProfileService.postProfile(profile);
      set({
        profiles: [...get().profiles, newProfile.data as ProfileInterface],
      });
    } catch (error) {
      console.log("❌Error en addProfile", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
  editProfile: async (id, profile) => {
    try {
      const { data } = await ProfileService.putProfile(id, profile);
      set({
        profiles: get().profiles.map((p) =>
          p.id === id ? { ...p, profile } : p
        ) as ProfileInterface[],
      });
    } catch (error) {
      console.log("❌Error en editProfile", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
  setSelectedProfileById: (id: number) => {
    set({ selectedProfile: get().profiles.find((p) => p.id === id) });
  },
  getSelectedProfile: () => get().selectedProfile,
  getProfileById: (id: number) => get().profiles.find((p) => p.id === id),
  deleteProfile: async (id) => {
    try {
      await ProfileService.deleteProfile(id);
      set({ profiles: get().profiles.filter((p) => p.id !== id) });
    } catch (error) {
      console.log("Error deleting profile data", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
});

export const useProfileStore = create<ProfileStore>()(
  devtools(
    persist(immer(profilesAPI), {
      name: "profiles-store",
    })
  )
);
