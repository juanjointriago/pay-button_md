
export interface ResponseLoginInterface {
    msg: string;
    error: boolean;
    records: number;
    data: LoginData;
    token: string;
}

export interface LoginData {
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
    phone: null;
    postCode: null;
}

export interface ResponseErrorLogin {
    error: string,
    error_description: string
}
export type LoginInterface = {
    username: string;
    password: string;
}

