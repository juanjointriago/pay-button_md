import { LoginData, VALID_ENTITIES, VALID_ROLES } from "../interfaces/auth.interface";


export const isAuthorized = (userData: LoginData, { entity, role }: { entity: VALID_ENTITIES, role: VALID_ROLES }) => {
  if (!userData?.profile?.entities?.length) return false;
  return Boolean(userData.profile.entities.find(e => e.name === entity)?.roles.some(r => r.name === role));
}
