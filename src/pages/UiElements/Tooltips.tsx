import TooltipsOne from '../../components/ToolTips/TooltipsOne';
import TooltipsTwo from '../../components/ToolTips/TooltipsTwo';

const Tooltips: React.FC = () => {
  return (
    <>
      {/* <Breadcrumb pageName="Tooltips" /> */}

      <div className="flex flex-col gap-7.5">
        <TooltipsOne />
        <TooltipsTwo />
      </div>
    </>
  );
};

export default Tooltips;
