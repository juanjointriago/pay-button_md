import { create, StateCreator } from "zustand";
import { ParamInterface } from "../../interfaces/params.interface";
import { ParamsService } from "../../services/Params.service";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { AuthService } from "../../services/Auth.service";

export interface ParamsStore {
  params: ParamInterface[];
  getAndSetParams: () => Promise<void>;
  addParam: (param: ParamInterface) => Promise<void>;
  editParam: (id: number, param: ParamInterface) => Promise<void>;
  selectedParam: ParamInterface;
  getSelectedParam: () => ParamInterface;
  setSelectedParamById: (id: number) => void;
  deleteParam: (id: number) => Promise<void>;
}

const paramsAPI: StateCreator<
  ParamsStore,
  [["zustand/devtools", never], ["zustand/immer", never]]
> = (set, get) => ({
  params: [],
  selectedParam: {} as ParamInterface,
  getAndSetParams: async () => {
    try {
      const { data } = await ParamsService.getParams();
      set({ params: data.data });
    } catch (error) {
      console.log("Error getting param data", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
  addParam: async (param) => {
    try {
      const { data } = await ParamsService.postParam(param);
      set({ params: [...get().params, data.newParam] });
    } catch (error) {
      console.log("Error adding param data", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
  /**
   * Edita un parametro existente en la BD.
   * @param {number} id El id del parametro a editar
   * @param {ParamInterface} param El objeto parametro con los datos a editar
   * @returns Promise<void>
   */
  editParam: async (id, param) => {
    try {
      await ParamsService.putParam(id, param);
      set({ params: get().params.map((p) => (p.id === id ? param : p)) });
    } catch (error) {
      console.log("Error editing param data", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
  setSelectedParamById: (id: number) => {
    console.log("Seleccionado ", id);
    set({ selectedParam: get().params.find((p) => p.id === id) });
  },
  getSelectedParam: () => get().selectedParam,
  deleteParam: async (id) => {
    try {
      await ParamsService.deleteParam(id);
      set({ params: get().params.filter((p) => p.id !== id) });
    } catch (error) {
      console.log("Error deleting param data", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
});

export const useParamStore = create<ParamsStore>()(
  devtools(
    persist(immer(paramsAPI), {
      name: "params-store",
    })
  )
);
    