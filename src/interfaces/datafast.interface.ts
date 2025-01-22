export interface IDataFastCheckoutResponse {
  result: Result;
  buildNumber: string;
  timestamp: string;
  ndc: string;
  id: string;
}

export interface Result {
  code: string;
  description: string;
}

