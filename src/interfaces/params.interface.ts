export interface ParamInterface {
    id?:     number;
    key:    string;
    value:  string;
    active?: number;
}

export interface ResponseParamsInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    ParamInterface[];
}


export interface ResponsePostParam {
    newParam: ParamInterface;
    msg:      string;
}

export interface ResponseParamInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    ParamInterface;
}

export interface ResponsePUTParam {
    msg:     string;
    error:   boolean;
    records: number;
}




