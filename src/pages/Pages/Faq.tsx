import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const Faq: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Faq's" />

      <div className="flex flex-col gap-7.5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6 xl:px-9">
            <h3 className="font-medium text-black dark:text-white">Style 1</h3>
          </div>

        </div>
      </div>
    </>
  );
};

export default Faq;
