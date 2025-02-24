
import { Link, useNavigate, useParams } from "react-router-dom";
import Logo from "../../images/logo/logo-m-duran.jpg";
import { useEffect, useState } from "react";
import API from "../api/api";
import { to } from "../../utils/to";
import Swal from "sweetalert2";

export const VerifyAccount = () => {
  const { verifyToken } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyAccount = async () => {
      setVerifying(true);
      const [error] = await to(API.get(`auth/verifyAccount/${verifyToken}`));
      if (error) {
        const result = await Swal.fire({
          icon: "error",
          title: "Error", // 'Oops...',
          text: "Error al tratar de verificar", // 'Debes seleccionar una sola fila',
          confirmButtonColor: "blue",
        });

        if(result.isConfirmed || result.isDismissed) navigate('/auth/signin');

        setVerifying(false);
        return;
      }

      setVerifying(false);
    }

    verifyAccount();
  }, []);

  if(verifying) return <></>;
  

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full relative">
      <img className="opacity-5 h-1/2 rounded-md absolute" src={Logo} alt="Logo" />

      <h1
        className="text-6xl font-bold text-blue-900 text-center mb-4 opacity-90"
      >Cuenta verificada correctamente</h1>

      <Link to="/auth/signin" className="text-blue-900 hover:underline z-1">
        <button
          className="bg-blue-900 text-white rounded-md px-4 py-2 font-bold text-lg hover:bg-blue-800/90 hover:cursor-pointer z-1 mt-8"
        >Ir a el Inicio de Sesión</button>
      </Link>
    </div>
  )
};
