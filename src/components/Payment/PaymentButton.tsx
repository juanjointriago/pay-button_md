import { useEffect, useState } from "react";
import { Modal } from "../shared/Modal";
import { to } from "../../utils/to";
import { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ScreenLoader } from "../shared/ScreenLoader";
import { createPortal } from "react-dom";
import API from "../../pages/api/api";

interface PaymentButtonProps {
  onStartPayment: (generateCheckoutId: (paymentValues: any) => void) => void;
}

export const PaymentButton = ({ onStartPayment }: PaymentButtonProps) => {
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

    to(API.post('paymentButton/savePayment', { checkoutId: paymentId }))
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

  const generateCheckoutId = async (paymentValues: any) => {
    setIsLoadingCheckout(true);
    const [error, response] = await to<AxiosResponse<{data: { id: string }}>>(API.post('paymentButton/requestCheckout', paymentValues));
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

    const dataFastId = response.data.data.id;
    setDataFastId(dataFastId);
  }


  return (
    <>
      {
        createPortal(<ScreenLoader isLoading={isLoadingCheckout} />, document.getElementById('body'))
      }

      <button
        className="rounded bg-blue-950 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={() => onStartPayment(generateCheckoutId)}
      >Realizar Pago</button>

      {
        createPortal(
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
          </Modal>,

          document.getElementById('root')
        )
      }
    </>
  )
};
