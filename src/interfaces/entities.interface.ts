export interface ReponseEntitiesInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    Entity[];
}

export interface Entity {
    id:          number;
    name:        string;
    description: string;
    active:      number;
}
