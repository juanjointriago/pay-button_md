
export interface ResponseLoginInterface {
    msg: string;
    error: boolean;
    records: number;
    data: LoginData;
    token: string;
}

export interface ResponseErrorLogin {
    error: string,
    error_description: string
}
export type LoginInterface = {
    username: string;
    password: string;
}


export interface LoginData {
    id: number;
    username: string;
    email: string;
    active: number;
    createdAt: Date;
    updatedAt: Date;
    verified: number;
    verifiedToken: null;
    lastname: string;
    name: string;
    address: string;
    country: string;
    middlename: string;
    phone: string;
    postCode: string;
    profile: Profile;
}

export interface Profile {
    id: number;
    name: string;
    description: string;
    active: number;
    entities?: Entity[];
    // roles?: Profile[];
}

interface Entity extends Omit<Profile, 'entities'> {
    name: VALID_ENTITIES;
    roles: Role[];
}

interface Role extends Omit<Profile, 'entities'> {
    name: VALID_ROLES;
}

export type VALID_ROLES = 'ALLOW_READ' | 'ALLOW_UPDATE' | 'ALLOW_CREATE' | 'ALLOW_DELETE' | 'ALLOW_PAYMENT' | 'ALLOW_READ_PAYMENTS' | 'ALLOW_READ_DEBTS' | 'ALLOW_READ_TRANSACTIONS';

export type VALID_ENTITIES = 'STADISTICS' | 'DEBTS' | 'PARAMETERS' | 'DATAFAST' | 'USERS' | 'PROFILES';