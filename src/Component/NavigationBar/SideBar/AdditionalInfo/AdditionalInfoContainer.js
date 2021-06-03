import React from "react";
import AdditionalInfoCard from "./AdditionalInfoCard";
import {Accordion, AccordionItem, AccordionItemHeading, AccordionItemPanel, AccordionItemButton} from "react-accessible-accordion";
import WasteAppliances from "./WasteAppliances";
import './AdditionalInfoContainer.css';
import Dumpster from "./Dumpster";
import {list} from "./infoList";

export default function AdditionalInfoContainer() {
    return (
        <Accordion allowZeroExpanded>
            {
                list.map((l, i) => (
                    <AccordionItem key={l.id}>
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                {l.title}
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel className='items'>
                            {l.component}
                        </AccordionItemPanel>
                    </AccordionItem>
                ))
            }
        </Accordion>
    );
}
