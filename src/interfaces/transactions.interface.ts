export interface IResponseTransaction {
    msg: string;
    error: boolean;
    records: number;
    data: IDonePayment[];
}

export interface IDonePayment {
    id: number;
    customerId: number;
    cashier: number;
    debtId: number;
    ipSession: string;
    macAddressUser: null;
    observation: null;
    receiptNumber: string;
    bank_id: number;
    cardNumber: string;
    cardExpirationDate: string;
    cardAuthorization: string;
    cardVoucherNumber: string;
    cardHolderName: string;
    amount: number;
    message: string;
    createdAt: Date;
    transactionId: number;
    debt: Debt;
    transaction: Transaction;
}

export interface Debt {
    id: number;
    titleName: string;
    liquidationCode: string;
    shopperName: string;
    identification: number;
    courtCosts: number;
    localCode: string;
    plotId: number;
    actionLiquidationType: number;
    liquidationState: number;
    year: number;
    surcharge: number;
    discount: number;
    interest: number;
    coercive: number;
    totalAmount: number;
    createdAt: Date;
    liquidationId: number;
}

export interface Transaction {
    id: number;
    type: string;
    state: string;
    order: number;
    executionDate: Date;
    trxId: string;
    bankResponse: string;
    responseText: string;
    lot: null | string;
    reference: string;
    acquirerId: number;
    authorization: number;
    buttonResponse: string;
    amount: number;
    interest: number;
    totalAmount: number;
    jsonResponse: string;
}
