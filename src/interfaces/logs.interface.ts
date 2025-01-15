export interface ReponseLogsInterface {
    msg:     string;
    error:   boolean;
    records: number;
    page:    number;
    data:    LogInterface[];
}

export interface LogInterface {
    id:        number;
    entity:    string;
    type:      Type | string;
    action:    Action;
    short_msg: string;
    long_msg:  string;
    user:      User;
    ip:        IP;
    program:   Program | string;
    version:   Version;
    createdAt: Date;
}

export enum Action {
    APIAuthLogin = "/api/auth/login",
    Insert = "INSERT",
    Update = "UPDATE",
}

// export enum Entity {
//     Bd = "BD",
//     Param = "PARAM",
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
