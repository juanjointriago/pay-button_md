import { create, StateCreator } from "zustand";
import { RoleInterface } from "../../interfaces/roles.interface";
import { RoleService } from "../../services/Role.service";
import { devtools, persist } from "zustand/middleware";

export interface RoleState {
    roles: RoleInterface[],
    getRoles: () => Promise<void>,
    getRoleById: (id: number) => RoleInterface ,
    addRole: (role: RoleInterface) => Promise<void>,
    editRole: (id:number, role: RoleInterface) => Promise<void>,
    deleteRole: (id: number) => Promise<void>
}


const rolesAPI: StateCreator<
    RoleState,
    [["zustand/devtools", never], ["zustand/immer", never]]>= (set, get) => ({
    roles: [],
    getRoles: async () => {
        const { data } = await RoleService.getRoles();
        set({ roles: data });
    },
    getRoleById:  (id) => {
       return  get().roles.find((r) => r.id === id);
    },
    addRole: async (role) => {
        const { newRole } = await RoleService.postRole(role);
        set({ roles: [...get().roles, role] });
        newRole && console.log('INFO adding role data',newRole)
    },
    editRole: async (id, role) => {
        const { msg } = await RoleService.putRole(id, role);
        set({ roles: get().roles.map((r) => r.id === id ? role : r) });
        msg && console.log('WARN putting role data',msg)
    },
    deleteRole: async (id) => {
        const { msg } = await RoleService.deleteRole(id);
        set({ roles: get().roles.filter((r) => r.id !== id) });
        msg && console.log('Error deleting role data',msg)
    },
    })

    export const useRoleStore = create<RoleState>()(
        devtools(
            persist(rolesAPI, {
                name: "roles-store",
            })
        )
    )


