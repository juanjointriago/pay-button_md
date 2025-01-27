export interface ReponseTransactionsInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    Transaction[];
}

export interface Transaction {
    id:         string;
    state:      State;
    checkoutId: string;
    debtId:     number;
    paymentId:  number;
    debt:       Debt;
    payment:    Payment;
}

export interface Debt {
    id:                    number;
    titleName:             string;
    liquidationCode:       string;
    debtDate:              Date;
    shopperName:           string;
    identification:        number;
    courtCosts:            number | null;
    localCode:             string;
    plotId:                number;
    actionLiquidationType: number;
    liquidationState:      number;
    year:                  number;
    surcharge:             number;
    discount:              number;
    interest:              number;
    coercive:              number;
    totalAmount:           number;
    createdAt:             Date;
    liquidationId:         number;
}

// export enum LocalCode {
//     The11921000000Lc4 = "1.19.2.1.0.0.0.0.0.0 LC:4",
//     The11921000000Lc8 = "1.19.2.1.0.0.0.0.0.0 LC:8",
//     The19487000000 = "1.9.48.7.0.0.0.0.0.0",
//     The19488000000 = "1.9.48.8.0.0.0.0.0.0",
// }

// export enum ShopperName {
//     IntriagoJuanJose = "INTRIAGO JUAN JOSE",
// }

// export enum TitleName {
//     CasaNueva = "CASA NUEVA",
//     TasaDeHabilitacionYControl = "TASA DE HABILITACION Y CONTROL",
//     TasaDeHabilitacionYControlParaPelarenas = "TASA DE HABILITACION Y CONTROL PARA PELARENAS",
//     VentaDeTerrenos = "VENTA DE TERRENOS",
// }

export interface Payment {
    id:             number;
    customerId:     number;
    cashier:        number;
    createdAt:      Date;
    debtId:         number;
    ipSession:      IPSession;
    macAddressUser: string;
    observation:    string;
    paymentDate:    Date;
    receiptNumber:  string;
    PaymentDetail:  PaymentDetail[];
}

export interface PaymentDetail {
    id:                 number;
    paymentId:          number;
    bank_id:            number;
    cardNumber:         string;
    cardExpirationDate: string;
    cardAuthorization:  string;
    cardVoucherNumber:  string;
    cardHolderName:     string;
    message:            string;
    createdAt:          Date;
}

export enum IPSession {
    The1 = "::1",
}

export enum State {
    P = "P",
    S = "S",
}
