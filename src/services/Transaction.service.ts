import { ReponseTransactionsInterface } from "../interfaces/transaction.interface";
import API from "../pages/api/api";

export class TransactionService {
  static getTransactions = async () => {
    const route = "transactions";
    const response = await API.get<ReponseTransactionsInterface>(route);
    return response;
  };
}
