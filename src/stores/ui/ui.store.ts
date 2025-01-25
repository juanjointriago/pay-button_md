import { create, StateCreator } from "zustand";
import { useRoleStore } from "../roles/roles.store";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { RoleInterface } from "../../interfaces/roles.interface";
import { useAuthStore } from "../auth/auth.store";


interface ScreenSettings {
    profileId: number;
    screenName: string;
    roles: RoleInterface[];
}
interface UIStore {
    ScreenSettings: ScreenSettings;
    ScreenAvaliable: string[];
    setScreenSettings: () => void;
}


const uiAPI: StateCreator<UIStore, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    ScreenSettings: {}as ScreenSettings,
    ScreenAvaliable: [ ],
/**
 * Updates the ScreenSettings with the provided screenSettings object.
 * Retrieves the roles, user, and profile information from their respective stores.
 * Constructs a userScreenSettings object using the profileId and screenName.
 * Sets the ScreenSettings state with the userScreenSettings.
 *
 * @param screenSettings - The new screen settings to be applied.
 */

    setScreenSettings: () => {
        const roles = useRoleStore(state=>state.roles);
        const user = useAuthStore(state=>state.user);

        const userScreenSettings : ScreenSettings = {
            profileId: user.profileId,
            screenName: get().ScreenAvaliable[0],
            roles: roles
        }
        
        set({ ScreenSettings:  userScreenSettings });
    },
});


export const useUIStore = create<UIStore>()(
    devtools(
        persist(
            immer(uiAPI),
            {
                name: "ui-store",
            }
        )
    )
)