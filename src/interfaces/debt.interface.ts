export interface ReponseDebtsInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    DebtInterface[];
}
export interface ReponseDebtInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    DebtInterface;
}


export interface DebtInterface {
    id:                    number;
    customerId:            number;
    titleName:             string;
    liquidationCode:       string;
    debtDate:              Date;
    shopperName:           string;
    identification:        number;
    courtCosts:            null;
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
}
