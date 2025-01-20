import { ReponseDebtInterface, ReponseDebtsInterface } from "../interfaces/debt.interface";
import API from "../pages/api/api";

export class DebtService {
  static getAllDebt = async () => {
    const route = "debt";
    const { data } = await API.get<ReponseDebtsInterface>(route);
    return data;
  };
  static getDebtById = async (id: number) => {
    const route = `debt/${id}`;
    const { data } = await API.get<ReponseDebtInterface>(route);
    return data;
  };
}
