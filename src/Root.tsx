import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuthStore } from './stores/auth/auth.store';


export const Root = () => {
  // const authStatus = useAuthStore((state) => state.status);
  const { pathname } = useLocation();

  // if(authStatus === 'checking') return <></>;

  // if(authStatus === 'unauthorized') {
  //   return <Navigate to="/logout" />;
  // }

  if (pathname === '/') {
    return <Navigate to="/home" />;
  }
  
  return (
    <main>
      <Outlet />
    </main>
  )
}