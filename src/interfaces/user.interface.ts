
export interface ResponseUsersInterface {
    msg:     string;
    error:   boolean;
    records: number;
    page:    number;
    data:    UserInterface[];
}

export interface UserInterface {
    id?:        number;
    username:  string;
    password:  string;
    email:     string;
    active:    number;
    profileId: number;
    createdAt: Date;
    updatedAt: Date;
    // roles:     RoleUser[];
}

export interface AddUserInterface {
    id?:        number;
    username:  string;
    password:  string;
    email:     string;
    profileId: number;
    roleId:    number;     
}

export interface RoleUser {
    id:         number;
    userId:     number;
    roleId:     number;
    assignedAt: Date;
}

export interface ResponsePOSTUser {
    resCode:    string;
    resMessage: string;
    resRows:    number;
    maxRows:    string;
    data:       boolean;
}


export interface ResponseUserInterface {
    msg:     string;
    error:   boolean;
    records: number;
    data:    UserInterface;
}


export interface Role {
    id:         number;
    userId:     number;
    roleId:     number;
    assignedAt: Date;
}


export interface ReponsePostUserInterface {
    updatedUser: UpdatedUser;
    msg:         string;
}

export interface UpdatedUser {
    id:        number;
    username:  string;
    password:  string;
    email:     string;
    active:    number;
    profileId: number;
    createdAt: Date;
    updatedAt: Date;
}


