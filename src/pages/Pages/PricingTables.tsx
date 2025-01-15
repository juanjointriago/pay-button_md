import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import PricingTableOne from '../../components/PricingTables/PricingTableOne';

const PricingTables: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Pricing Table" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <PricingTableOne />
      </div>
    </>
  );
};

export default PricingTables;
