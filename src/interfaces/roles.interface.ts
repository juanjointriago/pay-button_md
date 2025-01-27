export interface ResponseRolesInterface {
    msg: string;
    error: boolean;
    records: number;
    page: number;
    data: RoleInterface[];
  }
  
  export interface ResponseRoleInterface {
    msg: string;
    error: boolean;
    records: number;
    data: RoleInterface;
  }
  
  export interface RoleInterface {
    id: number;
    name: string;
    description: string | null;
    active: number;
    entities: string[];
  }
  
  export interface PostRoleInterface{
    name: string;
    description: string | null;
    entities: string[];
  }
  
  export interface RoleDetail {
    id: number;
    roleId: number;
    entity: string;
    active: number;
  }
  export interface RoleProfileInterface extends RoleInterface {
    assignedAt: Date;
    role: RoleDetail[];
  }
  export interface ResponsePOSTRole {
    id?: number | undefined;
    newRole: RoleInterface;
    msg: string;
  }
  
  export interface ResponsePutRoleInterface {
  msg:     string;
  error:   boolean;
  records: number;
}
