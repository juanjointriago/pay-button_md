import React from 'react';
import AccordionOne from '../../components/Accordions/AccordionOne';
import AccordionTwo from '../../components/Accordions/AccordionTwo';

const Accordion: React.FC = () => {
  return (
    <>

      <div className="flex flex-col gap-7.5">
        <AccordionOne />
        <AccordionTwo />
      </div>
    </>
  );
};

export default Accordion;
