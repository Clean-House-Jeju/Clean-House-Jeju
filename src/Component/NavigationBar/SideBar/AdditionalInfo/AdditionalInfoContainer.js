import React from "react";
import AdditionalInfoCard from "./AdditionalInfoCard";
import {Accordion, AccordionItem, AccordionItemHeading, AccordionItemPanel, AccordionItemButton} from "react-accessible-accordion";
import WasteAppliances from "./WasteAppliances";
import './AdditionalInfoContainer.css';

export default function AdditionalInfoContainer() {
    return (
        <Accordion allowZeroExpanded>
            <AccordionItem key={0}>
                <AccordionItemHeading>
                    <AccordionItemButton>
                        {'안녕'}
                    </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className='items'>
                    <WasteAppliances/>
                </AccordionItemPanel>
            </AccordionItem>

        </Accordion>
    );
}
