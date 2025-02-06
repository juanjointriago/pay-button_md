

export const NoAuthorized = () => {
  return (
    <div>
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-bodydark text-center">
          <h1 className="text-4xl font-bold">No tienes permisos para acceder a esta página</h1>
          <p className="text-bodydark text-center">
            Por favor, contacta con el administrador del sistema
          </p>
        </div>
      </div>
    </div>
  )
};
