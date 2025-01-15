import { create, StateCreator } from "zustand";
import { ProfileAddInterface, ProfileInterface } from "../../interfaces/profiles.interface";
import { ProfileService } from "../../services/Profile.service";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface ProfileStore{
    profiles: ProfileInterface[],
    getProfiles: () => Promise<void>,
    addProfile: (profile: ProfileAddInterface) => Promise<void>,
    editProfile: (id:number, profile: ProfileAddInterface) => Promise<void>,
    selectedProfile: ProfileInterface,
    getSelectedProfile: () => ProfileInterface,
    setSelectedProfileById: (id: number) => void,
    deleteProfile: (id: number) => Promise<void>
}


const profilesAPI:StateCreator<
ProfileStore,
[["zustand/devtools", never], ["zustand/immer", never]]>= (set, get) => ({
    profiles: [],
    selectedProfile: {} as ProfileInterface,
    getProfiles: async () => {
        const { data } = await ProfileService.getProfiles();
        set({ profiles: data as ProfileInterface[] });
    },
    addProfile: async (profile) => {
        const { data: newProfile } = await ProfileService.postProfile(profile);
        set({ profiles: [...get().profiles, newProfile as ProfileInterface] });
    },
    editProfile: async (id, profile) => {
        const { error } = await ProfileService.putProfile(id, profile);
        set({ profiles: get().profiles.map((p) => p.id === id ? profile : p) as ProfileInterface[] });
        error && console.log('Error putting profile data',error)
    },
    setSelectedProfileById: (id: number) => {
        set({ selectedProfile: get().profiles.find((p) => p.id === id) })
    },
    getSelectedProfile: () => get().selectedProfile,
    deleteProfile: async (id) => {
        const { error } = await ProfileService.deleteProfile(id);
        set({ profiles: get().profiles.filter((p) => p.id !== id) });
        error && console.log('Error deleting profile data',error)
        
    }
})

export const useProfileStore = create<ProfileStore>()(
    devtools(
        persist(immer(profilesAPI), {
            name: "profiles-store",
        })
    )
)