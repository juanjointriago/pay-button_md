import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useDisclosure } from './useDisclosure';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/shared/Modal';
import { to } from '../utils/to';
import Swal from 'sweetalert2';
import API from '../pages/api/api';


export const usePayment = () => {
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [dataFastId, setDataFastId] = useState('');
  const navigate = useNavigate();

  // DATAFAST CERTIFICATION FOR PRODUCTION
  useEffect(() => {
    if (!window.wpwlOptions) window.wpwlOptions = {};
    wpwlOptions.onReady = function () {
      var datafast = '<br/><br/><img src="https://www.datafast.com.ec/images/verified.png" style="display:block;margin:0 auto; width:100%;">';
      const form = document.querySelector('form.wpwl-form-card');
      const button = form?.querySelector('.wpwl-button');
      button?.insertAdjacentHTML('beforebegin', datafast);
    };
    wpwlOptions.style = "card";
    wpwlOptions.locale = "es";
    wpwlOptions.labels = { cvv: "CVV", cardHolder: "Nombre(Igual que en la tarjeta)" };

    return () => {
      window.wpwlOptions.onReady = undefined;
      window.wpwlOptions.onBeforeSubmitCard = undefined;
      window.wpwlOptions.style = undefined;
      window.wpwlOptions.locale = undefined;
      window.wpwlOptions.labels = undefined;
    }
  }, [dataFastId]);

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

    // console.log("paymentId", paymentId);

    if (!paymentId) return;

    // to(axios.get(`http://localhost:3001/payment/${paymentId}`))
    to(API.post('paymentButton/savePayment', { checkoutId: paymentId }))
      .then(([error]) => {
        navigate('/home/debt');
        if (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Ocurrió un error al realizar el pago',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          })
        } else {
          Swal.fire({
            title: 'Pago Realizado',
            text: 'Su pago ha sido realizado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
        }
      });
  }, []);

  const PaymentModal = (
    <Modal open={isOpen} closeOnBlur={false} onToggleModal={(isOpen: boolean) => isOpen ? onOpen() : onClose()}>
      <form
        action={'/home/debt'}
        className='paymentWidgets'
        data-brands='VISA MASTER AMEX DINERS DISCOVER'
      ></form>

      <button
        onClick={() => onClose()}
        className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
      >
        Cancelar
      </button>
    </Modal>
  );

  const generateCheckoutId = async (paymentValues: any) => {
    setIsLoadingCheckout(true);
    const [error, response] = await to<AxiosResponse<{ data: { id: string } }>>(API.post('paymentButton/requestCheckout', paymentValues));
    setIsLoadingCheckout(false);
    onOpen();
    if (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Ocurrió un error al realizar el pago',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      onClose();
      return;
    }

    const dataFastId = response.data.data.id;
    // const dataFastId = response.data.id;
    setDataFastId(dataFastId);
  }


  return {
    generateCheckoutId,
    PaymentModal,
    isLoadingCheckout,
  }
}
