export interface ResponseEntitiesInterface {
    msg:   string;
    error: boolean;
    data:  Entity[];
}
type has_audited = number | 0 | 1

export interface Entity {
    table_name: string;
    has_audited: has_audited;
}

export interface ResponseActiveAudit {
    msg: string;
}
