export interface ResponseRolesInterface {
    msg:     string;
    error:   boolean;
    records: number;
    page:    number;
    data:    RoleInterface[];
}

export interface ResponseRoleInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    RoleInterface;
}


export interface RoleInterface {
    id:          number;
    name:        string;
    description: null;
    active:      number;
}

export interface ResponsePOSTRole {
    newRole: RoleInterface;
    msg:     string;
}


export enum Action {
    APIAuthLogin = "/api/auth/login",
    Insert = "INSERT",
    Update = "UPDATE",
}

// export enum Entity {
//     Bd = "BD",
//     Role = "ROLE",
//     User = "USER",
// }

export enum IP {
    Empty = "",
    The1 = "::1",
}

export enum Program {
    BackNodeAudit = "BACK-NODE-AUDIT",
    Supabase = "SUPABASE",
}

export enum Type {
    Audit = "AUDIT",
    DML = "DML",
}

export enum User {
    AdminAdminCOM = "admin@admin.com",
    Donboty = "donboty",
    Empty = "",
    Pingilo = "pingilo",
    Pinguilo = "pinguilo",
    Postgres = "postgres",
}

export enum Version {
    Empty = "",
    The001 = "0.0.1",
}


