import { create, StateCreator } from "zustand";
import { DebtInterface } from "../../interfaces/debt.interface";
import { DebtService } from "../../services/Debt.service";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface DebtStore {
  debts: DebtInterface[];
  getAndSetDebts: () => Promise<void>;
  getDebtById: (id: number) => Promise<void>;
  // addDebt: (debt: DebtInterface) => Promise<void>
  // editDebt: (id: number, debt: DebtInterface) => Promise<void>
  // deleteDebt: (id: number) => Promise<void>
  selectedDebt: DebtInterface;
  getSelectedDebt: () => DebtInterface;
  setSelectedDebtById: (id: number) => void;
}

const paramsAPI: StateCreator<
  DebtStore,
  [["zustand/devtools", never], ["zustand/immer", never]]
> = (set, get) => ({
  debts: [],
  selectedDebt: {} as DebtInterface,
  getAndSetDebts: async () => {
    const { data } = await DebtService.getAllDebt();
    set({ debts: data });
  },
  getDebtById: async (id) => {
    const { data } = await DebtService.getDebtById(id);
    set({ selectedDebt: data });
  },
  // addDebt: async (debt) => {
  //     const { newDebt } = await DebtService.postDebt(debt);
  //     set({ debts: [...get().debts, newDebt] });
  // },
  // editDebt: async (id, debt) => {
  //     const { msg } = await DebtService.putDebt(id, debt);
  //     set({ debts: get().debts.map((d) => d.id === id ? debt : d) });
  //     msg && console.log('WARN putting debt data',msg)
  // },
  // deleteDebt: async (id) => {
  //     const { msg } = await DebtService.deleteDebt(id);
  //     set({ debts: get().debts.filter((d) => d.id !== id) });
  //     msg && console.log('WARN deleting debt data',msg)
  // },
  getSelectedDebt: () => get().selectedDebt,
  setSelectedDebtById: (id: number) => {
    set({ selectedDebt: get().debts.find((d) => d.id === id) });
  },
});

export const useDebts = create<DebtStore>()(
  devtools(
    persist(immer(paramsAPI), {
      name: "debts-store",
    })
  )
);
