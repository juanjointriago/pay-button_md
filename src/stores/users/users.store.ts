import { create, StateCreator } from "zustand";
import {
  AddUserInterface,
  UserInterface,
} from "../../interfaces/user.interface";
import { UserService } from "../../services/User.service";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface UserStore {
  users: UserInterface[];
  selectedUser: UserInterface;
  getSelectedUser: () => UserInterface;
  setSelectedUserById: (id: number) => void;
  getUsers: () => Promise<void>;
  addUser: (user: AddUserInterface) => Promise<void>;
  editUser: (id: number, user: UserInterface) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

const usersAPI: StateCreator<
  UserStore,
  [["zustand/devtools", never], ["zustand/immer", never]]
> = (set, get) => ({
  users: [],
  selectedUser: {} as UserInterface,
  getSelectedUser: () => get().selectedUser,
  setSelectedUserById: (id: number) => {
    set({ selectedUser: get().users.find((u) => u.id === id) });
  },
  getUsers: async () => {
    const { data } = await UserService.getUsers();
    set({ users: data });
  },
  addUser: async (user) => {
    if (user) {
      const updatedUser = await UserService.postUser(user);
      console.log("RESPUESTA DEL SERVICIO", { updatedUser });
      if (!updatedUser) {
        console.warn("Error adding user data");
        return;
      }
      const userData = await UserService.getUserById(updatedUser.id);
      set({ users: [...get().users, userData] });
      console.log("STOREINFO user added", userData);
    }
  },
  editUser: async (id, user) => {
    console.log('STORE EDITUSER',id, user);
    const { error } = await UserService.putUser(id, user);
    const newUsers = get().users.map((u) => (u.id === id ? user : u));
    console.log("newUsers", newUsers);
    const updatedUser = await UserService.getUserById(id);
    set({ users: get().users.map((u) => (u.id === id ? updatedUser : u)) });
    error && console.log("Error putting user data", error);
  },
  deleteUser: async (id) => {
    const { error } = await UserService.deleteUser(id);
    set({ users: get().users.filter((u) => u.id !== id) });
    error && console.log("Error deleting user data", error);
  },
});

export const useUserStore = create<UserStore>()(
  devtools(
    persist(immer(usersAPI), {
      name: "users-store",
    })
  )
);
