import { create, StateCreator } from "zustand";

import { devtools, persist } from "zustand/middleware";
import { AuthService } from "../../services/Auth.service";
import { Entity } from "../../interfaces/entities.interface";
import { EntitiesService } from "../../services/Entities.service";

export interface EntitiesStore {
  entities: Entity[];
  getAndSetEntities: () => void;
}

const entitiesAPI: StateCreator<
  EntitiesStore,
  [["zustand/devtools", never], ["zustand/immer", never]]
> = (set) => ({
  entities: [],
  getAndSetEntities: async () => {
    try {
      const { data } = await EntitiesService.getEntities();
      set({ entities: data });
    } catch (error) {
      console.log("❌Error en getEntities", error);
      if (error.response.status === 401) {
        AuthService.logout();
      }
    }
  },
});
export const useEntitiesStore = create<EntitiesStore>()(
  devtools(
    persist(entitiesAPI, {
      name: "entities-store",
    })
  )
);
