export interface ResponseProfilesInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    ProfileInterface[];
}
export interface ReponseProfileInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    ProfileInterface | ProfileAddInterface;
}


export interface ProfileInterface {
    id:          number;
    name:        string;
    description: string;
    active:      number;
    roles:       RoleProfileInterface[];
}


export interface RoleProfileInterface {
    id:          number;
    profileId:   number;
    rolesId:      number;
    assignedAt?:  Date;
}

export interface ProfileAddInterface {
    name:        string;
    description: string;


}





