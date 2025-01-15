
export interface ResponseLoginInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    LoginData;
    token:   string;
}

export interface LoginData {
    id:        number;
    username:  string;
    password:  string;
    email:     string;
    active:    number;
    profileId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ResponseErrorLogin{
    error: string, 
    error_description: string
}
export type LoginInterface = {
    username: string;
    password: string;
  }

