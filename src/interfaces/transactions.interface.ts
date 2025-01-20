export interface ReponseTransactionInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    TransactionInterface[];
}
export interface ReponseDebtInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    TransactionInterface;
}


export interface TransactionInterface {
    id:                    number;
    customerId:            number;
    localCode:             string;
    paymentMethod:         string;
    totalAmount:           number;
    discount:              number;
    interest:              number;
    createdAt:             Date;
}
