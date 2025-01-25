import { useRoleStore } from "../../stores/roles/roles.store";

export const ViewRoleDetail = () => {
  const selectedRole = useRoleStore((state) => state.selectedRole);
  const selectedRoleDetails = !!selectedRole.roleDetails;
  const entities = selectedRoleDetails
    ? selectedRole.roleDetails.map((detail) => detail.entity).join(", ")
    : [];
  return (
    <>
      {selectedRole && (
        <div className="card">
          <div className="card-body">
            <p className="card-text">ID: {selectedRole.id}</p>
            <p className="card-text">Nombre: {selectedRole.name}</p>
            <p className="card-text">Descripción: {selectedRole.description}</p>
            <p className="card-text">
              Entidades:{" "}
              {entities.length
                ? entities
                : "No se han asignado entidades para este rol"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
