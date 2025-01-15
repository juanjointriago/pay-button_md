import { create, StateCreator } from "zustand";
import { Entity } from "../../interfaces/entities.interface";
import { EntitiesService } from "../../services/Entities.service";
import { devtools, persist } from "zustand/middleware";

export interface EntitiesStore {
  entities: Entity[];
  getAndSetEntities: () => void;
  activeEntity: (entity: string) => Promise<void>;
  inactiveEntity: (entity: string) => Promise<void>;
}

const entitiesAPI: StateCreator<
  EntitiesStore,
  [["zustand/devtools", never], ["zustand/immer", never]]
> = (set, get) => ({
  entities: [],
  getAndSetEntities: async () => {
    const { data } = await EntitiesService.getEntities();
    set({ entities: data });
  },
  activeEntity: async (entity) => {
    console.log("✅entity", entity);
    const { msg } = await EntitiesService.activeAudit(entity);
    msg && console.log("WARN activeEntity", msg);
  },
  inactiveEntity: async (entity) => {
    console.log("🗑️entity", entity);
    const { msg } = await EntitiesService.inactiveAudit(entity);
    msg && console.log("WARN inactiveEntity", msg);
  },
});
export const useEntitiesStore = create<EntitiesStore>()(
  devtools(
    persist(entitiesAPI, {
      name: "entities-store",
    })
  )
);
