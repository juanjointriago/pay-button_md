import { create, StateCreator } from "zustand";
import { LogInterface } from "../../interfaces/logs.interface";
import { LogService } from "../../services/Log.service";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { AuthService } from "../../services/Auth.service";
import { useAuthStore } from "../auth/auth.store";
import { useParamStore } from "../params/params.store";
import { useProfileStore } from "../profile/profile.store";
import { useRoleStore } from "../roles/roles.store";
import { useUserStore } from "../users/users.store";

interface LogsStore {
  logs: LogInterface[];
  getAndSetLogs: () => void;
  selectedLog: LogInterface;
  setSelectedLogById: (id: number) => void;
  getLogById: (id: number) => LogInterface | undefined;
  dmlLogs: LogInterface[];
  getDMLLogs: () => void;
}

const logsAPI: StateCreator<
  LogsStore,
  [["zustand/devtools", never], ["zustand/immer", never]]
> = (set, get) => ({
  logs: [],
  selectedLog: {} as LogInterface,
  setSelectedLogById: (id: number) => {
    const log = get().logs.find((log) => log.id === id);
    set({ selectedLog: log });
  },
  getLogById: (id: number) => {
    return get().logs.find((log) => log.id === id);
  },
  setSelectedLog: (log: LogInterface) => {
    set({ selectedLog: log });
  },
  getAndSetLogs: async () => {
    try {
      const { data } = await LogService.getLogs();
      set({ logs: data });
    } catch (error) {
      console.log("❌Error en getLogs", error);
      if (error.code === "ERR_BAD_REQUEST") {
        AuthService.logout();
        // useAuthStore.persist.clearStorage();
        // useLogsStore.persist.clearStorage();
        // useParamStore.persist.clearStorage();
        // useProfileStore.persist.clearStorage();
        // useRoleStore.persist.clearStorage();
        // useUserStore.persist.clearStorage();
        window.location.href = "/auth/signin";
      }
    }
  },
  dmlLogs: [],
  getDMLLogs: async () => {
    const { data } = await LogService.getLogs();
    set({ dmlLogs: data.filter((log) => log.type === "DML") });
  },
});

export const useLogsStore = create<LogsStore>()(
  devtools(
    persist(immer(logsAPI), {
      name: "logs-store",
    })
  )
);
