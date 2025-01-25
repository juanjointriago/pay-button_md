import { create, StateCreator } from "zustand";
import { PostRoleInterface, RoleInterface } from "../../interfaces/roles.interface";
import { RoleService } from "../../services/Role.service";
import { devtools, persist } from "zustand/middleware";
import { AuthService } from "../../services/Auth.service";

export interface RoleState {
  roles: RoleInterface[];
  selectedRole: RoleInterface;
  getRoles: () => Promise<void>;
  getRoleById: (id: number) => RoleInterface;
  setSelectedRoleById: (id: number) => void;
  addRole: (role: PostRoleInterface) => Promise<void>;
  editRole: (id: number, role: RoleInterface) => Promise<void>;
  deleteRole: (id: number) => Promise<void>;
}

const rolesAPI: StateCreator<
  RoleState,
  [["zustand/devtools", never], ["zustand/immer", never]]
> = (set, get) => ({
  roles: [],
  selectedRole: {} as RoleInterface,
  getRoles: async () => {
    try {
      const { data } = await RoleService.getRoles();
      set({ roles: data.data });
    } catch (error) {
      console.log("❌Error en getRoles", { error });
      if (error.response.status === 401) {
        AuthService.logout();
      }
      set({ roles: [] });
    }
  },
  getRoleById: (id) => {
    return get().roles.find((r) => r.id === id);
  },
  setSelectedRoleById: (id) => {
    set({ selectedRole: get().roles.find((r) => r.id === id) });
  },
  addRole: async (role) => {
    try {
      const { data } = await RoleService.postRole(role);
      console.log("✅addRole", { data });
      set({ roles: [...get().roles, data.newRole] });
    } catch (error) {
      console.log("❌Error en addRole", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
  editRole: async (id, role) => {
    try {
      const { data } = await RoleService.putRole(id, role);
      console.log("✅editRole", { data });
      set({
        roles: get().roles.map((r) => (r.id === id ? data.newRole : r)),
      });
    } catch (error) {
      console.log("❌Error en editRole", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
  deleteRole: async (id) => {
    try {
       await RoleService.deleteRole(id);
      set({ roles: get().roles.filter((r) => r.id !== id) });
    } catch (error) {
      console.log("❌Error en deleteRole", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
});

export const useRoleStore = create<RoleState>()(
  devtools(
    persist(rolesAPI, {
      name: "roles-store",
    })
  )
);
