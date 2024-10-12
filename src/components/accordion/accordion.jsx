import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AccordionWrapper = (props) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="">{props.title}</AccordionTrigger>
        <AccordionContent>
          {props.children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionWrapper;
