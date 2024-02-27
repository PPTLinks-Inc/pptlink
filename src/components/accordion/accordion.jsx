import { useState } from 'react';

const Accordion = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="accordion w-full text-white text-[0.8rem] mb-5">
            <div className="accordion_head flex justify-between items-center py-5 bg-transparent cursor-pointer border-b-[1px] border-solid border-white"
                onClick={() => setIsOpen(!isOpen)}>
                <h2 className="font-semibold">{props.title}</h2>
                <span className={isOpen ? "rotate-180" : "rotate-0"}>
                    <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                    </svg>
                </span>
            </div>
            {isOpen && <div className="accordion_body py-2">
                {props.children}
            </div>}
        </div>
    );
};

export default Accordion;