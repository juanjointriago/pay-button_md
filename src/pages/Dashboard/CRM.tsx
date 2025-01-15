import React from 'react';
import ChartEight from '../../components/Charts/ChartEight';
import ChartSeven from '../../components/Charts/ChartSeven';
import DataStatsThree from '../../components/DataStats/DataStatsThree';
import LeadsReport from '../../components/LeadsReport';

const CRM: React.FC = () => {
  return (
    <>
      <DataStatsThree />

      <div className="mt-7.5 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-7">
          <ChartSeven />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <ChartEight />
        </div>

        <LeadsReport />

      </div>
    </>
  );
};

export default CRM;
