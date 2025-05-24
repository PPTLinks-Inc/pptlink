import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AccordionWrapper = (props) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem isBorder={props.isBorder} value="item-1">
        <AccordionTrigger isDark={props.isDark} isBorder={props.isBorder} className="!w-full !text-left !text-wrap font-extrabold">{props.title}</AccordionTrigger>
        <AccordionContent>
          {props.children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionWrapper;
