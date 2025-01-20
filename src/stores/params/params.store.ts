import { create, StateCreator } from "zustand";
import { ParamInterface } from "../../interfaces/params.interface";
import { ParamsService } from "../../services/Params.service";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

 interface ParamsStore{
    params: ParamInterface[]
    getAndSetParams: () => Promise<void>
    addParam: (param: ParamInterface) => Promise<void>
    editParam: (id:number, param: ParamInterface) => Promise<void>
    selectedParam: ParamInterface
    getSelectedParam: () => ParamInterface
    setSelectedParamById: (id: number) => void
    deleteParam: (id: number) => Promise<void>
}

const paramsAPI:StateCreator<
    ParamsStore,
    [["zustand/devtools", never], ["zustand/immer", never]]
    > = (set, get) => ({
        params: [],
        selectedParam: {} as ParamInterface,
        getAndSetParams: async () => {
            const { data } = await ParamsService.getParams();
            set({ params: data });
        },
        addParam: async (param) => {
            const { newParam, msg } = await ParamsService.postParam(param);
            set({ params: [...get().params, newParam] });
            msg && console.log('INFO adding param data',msg)
        },
        /**
         * Edita un parametro existente en la BD.
         * @param {number} id El id del parametro a editar
         * @param {ParamInterface} param El objeto parametro con los datos a editar
         * @returns Promise<void>
         */
        editParam: async (id, param) => {
            const { error } = await ParamsService.putParam(id, param);
            set({ params: get().params.map((p) => p.id === id ? param : p) });
            error && console.log('Error putting param data',error)
        },
        setSelectedParamById: (id: number) => {
            console.log('Seleccionado ',id)
            set({ selectedParam: get().params.find((p) => p.id === id) })
        },
        getSelectedParam: () => get().selectedParam,
        deleteParam: async (id) => {
            const { error } = await ParamsService.deleteParam(id);
            set({ params: get().params.filter((p) => p.id !== id) });
            error && console.log('Error deleting param data',error)
        },
    })


    export const useParamStore = create<ParamsStore>()(
        devtools(
            persist(immer(paramsAPI), {
                name: "params-store",
            })
        )
    )