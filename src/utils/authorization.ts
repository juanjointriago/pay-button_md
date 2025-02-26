import { LoginData, VALID_ENTITIES, VALID_ROLES } from "../interfaces/auth.interface";


type AuthorizationParams = {
  entity: VALID_ENTITIES;
  role: VALID_ROLES;
}

export const isAuthorized = (userData: LoginData, { entity, role }: AuthorizationParams) => {
  if (!userData?.profile?.entities?.length) return false;
  return Boolean(userData.profile.entities.find(e => e.name === entity)?.roles.some(r => r.name === role));
}
