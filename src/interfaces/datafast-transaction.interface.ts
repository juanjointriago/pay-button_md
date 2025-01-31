export interface IDatafastTransaction {
  id: number;
  type: string;
  state: string;
  order: number;
  executionDate: Date;
  trxId: string;
  bankResponse: string;
  responseText: string;
  lot: null;
  reference: string;
  acquirerId: number;
  authorization: number;
  buttonResponse: string;
  amount: number;
  interest: number;
  totalAmount: number;
  jsonResponse: string;
  acquirer: Acquirer;
}

export interface Acquirer {
  id: number;
  username: string;
  password: string;
  email: string;
  active: number;
  createdAt: Date;
  updatedAt: Date;
  profileId: number;
  verified: number;
  verifiedToken: null;
  lastname: string;
  name: string;
  address: null;
  country: string;
  middlename: string;
  phone: string;
  postCode: null;
}
