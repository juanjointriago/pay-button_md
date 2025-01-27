import { useEffect, useState } from "react";
import { Modal } from "../shared/Modal";
import { to } from "../../utils/to";
import { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ScreenLoader } from "../shared/ScreenLoader";
import { createPortal } from "react-dom";
import API from "../../pages/api/api";

declare global {
  var wpwlOptions: {
    onReady?: () => void;
    onBeforeSubmitCard?: () => void;
    registrations?: {
      requireCvv?: boolean;
      hideInitialPaymentForms?: boolean;
    };
    style?: string;
    locale?: string;
    labels?: {
      cvv?: string;
      cardHolder?: string;
    };
  };
}

interface PaymentButtonProps {
  classNameButton?: React.HTMLAttributes<HTMLButtonElement>['className'];
  onStartPayment: (generateCheckoutId: (paymentValues: any) => void) => void;
}

export const PaymentButton = ({ classNameButton, onStartPayment }: PaymentButtonProps) => {
  const [dataFastId, setDataFastId] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  // const [reload, setReload] = useState(false);
  const navigate = useNavigate();

  // DATAFAST CERTIFICATION FOR PRODUCTION
  useEffect(() => {
    if (!dataFastId) return;
    if(!window.wpwlOptions) window.wpwlOptions = {};
    wpwlOptions.onReady = function () {
      var datafast = '<br/><br/><img src="https://www.datafast.com.ec/images/verified.png" style="display:block;margin:0 auto; width:100%;">';
      const form = document.querySelector('form.wpwl-form-card');
      const button = form?.querySelector('.wpwl-button');
      
      
      button?.insertAdjacentHTML('beforebegin', datafast);
      // setReload(s => !s);
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

  const generateCheckoutId = async (paymentValues: any) => {
    setIsLoadingCheckout(true);
    // const [error, response] = await to<AxiosResponse<{ data: { id: string } }>>(axios.post('http://localhost:3001/checkouts', paymentValues));
    const [error, response] = await to<AxiosResponse<{ data: { id: string } }>>(API.post('paymentButton/requestCheckout', paymentValues));
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
    // const dataFastId = response.data.id;
    setDataFastId(dataFastId);
  }


  return (
    <>
      {
        createPortal(<ScreenLoader isLoading={isLoadingCheckout} />, document.getElementById('body'))
      }

      <button
        className={classNameButton ? classNameButton : "rounded bg-blue-950 px-4 py-2 font-bold text-white hover:bg-blue-700"}
        onClick={() => onStartPayment(generateCheckoutId)}
      >Realizar Pago</button>

      {
        // createPortal(
          <Modal open={paymentModalOpen} onToggleModal={setPaymentModalOpen} closeOnBlur={false}>
            <div className="pt-4">
              <div className="[&>div>form>button]:hidden">
                <form action={'/home/debt'} className='paymentWidgets flex justify-center' data-brands='VISA MASTER AMEX DISCOVER'></form>

                {/* <script
                  dangerouslySetInnerHTML={{
                    __html: `
                  var wpwlOptions = {
                    onReady: function() {
                    console.log("onReady");
                    
                    var datafast= '<br/><br/><img src='+'"https://www.datafast.com.ec/images/verified.png"
                    style='+'"display:block;margin:0 auto; width:100%;">';
                    $('form.wpwl-form-card').find('.wpwl-button').before(datafast);
                    },
                  style: "card",locale: "es", labels: {cvv: "CVV", cardHolder: "Nombre(Igual que en la tarjeta)"}
                  }
          `,
                  }}
                /> */}
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
        //   ,

        //   document.getElementById('body')
        // )
      }
    </>
  )
};

