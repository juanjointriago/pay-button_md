import { useEffect, useState } from "react";
import { Modal } from "../shared/Modal";
import { to } from "../../utils/to";
import axios, { AxiosResponse } from "axios";
import { IDataFastCheckoutResponse } from "../../interfaces/datafast.interface";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


export const PaymentButton = () => {
  const [dataFastId, setDataFastId] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (!dataFastId) return;
    const script1 = document.createElement('script');
    const script2 = document.createElement('script');
    script1.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${dataFastId}`;
    script2.src = "js/jquery-3.6.0.min.js"
    script1.async = true;
    script2.async = true;
    document.body.appendChild(script1);
    document.body.appendChild(script2);

    // Limpieza del script si es necesario
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, [dataFastId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('id');
    if (!paymentId) return;

    to(axios.get(`http://localhost:3001/payment/${paymentId}`))
      .then(([error]) => {
        if (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Ocurrió un error al realizar el pago',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            navigate('/home/debt');
          });
        } else {
          Swal.fire({
            title: 'Pago Realizado',
            text: 'Su pago ha sido realizado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            navigate('/home/debt');
          });
        }
      });
  }, []);

  console.log("dataFastId", paymentModalOpen);

  return (
    <div>
      {
        isLoadingCheckout && <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black/80 z-9999">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-t-transparent mx-auto border-blue-700" />
        </div>
      }

      <button
        className="rounded bg-blue-950 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={async () => {
          setIsLoadingCheckout(true);
          const [error, response] = await to<AxiosResponse<IDataFastCheckoutResponse>>(axios.post('http://localhost:3001/checkouts', {}));
          setIsLoadingCheckout(false);
          setPaymentModalOpen(true);
          if (error) {
            Swal.fire({
              title: 'Error!',
              text: 'Ocurrió un error al realizar el pago',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
            setPaymentModalOpen(false);
            return;
          }

          const dataFastId = response.data.id;
          setDataFastId(dataFastId);
        }}
      >Pagar</button>

      <Modal open={paymentModalOpen} onToggleModal={setPaymentModalOpen} closeOnBlur={false}>
        <div className="pt-4">
          <div className="[&>div>form>button]:hidden">
            <form action={'/home/debt'} className='paymentWidgets flex justify-center' data-brands='VISA MASTER AMEX DISCOVER'></form>
          </div>

          <div className="2xsm:w-1/2 w-full mx-auto">
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="flex w-full rounded border border-stroke bg-slate-300 p-3 justify-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1 mx-auto"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
};
