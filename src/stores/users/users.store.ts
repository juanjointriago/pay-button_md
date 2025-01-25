import { create, StateCreator } from "zustand";
import {
  AddUserInterface,
  UserInterface,
} from "../../interfaces/user.interface";
import { UserService } from "../../services/User.service";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { AuthService } from "../../services/Auth.service";

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
    try {
      const { data } = await UserService.getUsers();
      set({ users: data.data });
    } catch (error) {
      console.error("Error getting user data", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
  addUser: async (user) => {
    try {
      if (user) {
        const response = await UserService.postUser(user);
        const userData = response.data.updatedUser;
        if (!userData) {
          return;
        }
        const { data } = await UserService.getUserById(userData.id);
        set({ users: [...get().users, data.data] });
        console.log("STOREINFO user added", userData);
      }
    } catch (error) {
      console.error("Error adding user data", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
  editUser: async (id, user) => {
    try {
      console.log("STORE EDITUSER", id, user);
      const { data } = await UserService.putUser(id, user);
      const newUsers = get().users.map((u) =>
        u.id === id ? { u, ...user } : u
      );
      // console.log("newUsers", newUsers);
      const updatedUser = await UserService.getUserById(id);
      set({ users: newUsers, selectedUser: updatedUser.data.data });
    } catch (error) {
      console.error("Error editing user data", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
  deleteUser: async (id) => {
    try {
      const { data } = await UserService.deleteUser(id);
      set({ users: get().users.filter((u) => u.id !== id) });
    } catch (error) {
      console.error("Error deleting user data", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
});

export const useUserStore = create<UserStore>()(
  devtools(
    persist(immer(usersAPI), {
      name: "users-store",
    })
  )
);
