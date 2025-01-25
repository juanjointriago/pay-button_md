import { Link } from 'react-router-dom';
import Illustration from '../../images/illustration/illustration-01.svg';
import {FaWatchmanMonitoring} from 'react-icons/fa';

const ErrorPage: React.FC = () => {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:py-20">
        <div className="mx-auto max-w-[410px]">
          <img src={Illustration} alt="illustration" />

          <div className="mt-7.5 text-center">
            <h2 className="mb-3 text-2xl font-bold text-black dark:text-white">
              Ups, Algo ha salido mal !!!
            </h2>
            <p className="font-medium">
              
            </p>
            <Link
              to="/"
              className="mt-7.5 inline-flex items-center gap-2 rounded-md bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90"
            >
              <FaWatchmanMonitoring/>
              <span>Volver al inicio</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
