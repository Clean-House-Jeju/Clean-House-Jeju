import React from "react";
import {Accordion, AccordionItem, AccordionItemHeading, AccordionItemPanel, AccordionItemButton} from "react-accessible-accordion";
import './AdditionalInfoContainer.css';
import {list} from "./infoList";

export default function AdditionalInfoContainer() {
    const style = {
        position: 'absolute',
        top: '5px',
        display: 'inline-flex',
        justifyContent: 'start',
        alignItems: 'center'

    }
    return (
        <Accordion allowZeroExpanded>
            {
                list.map((l) => (
                    <AccordionItem key={l.id}>
                        <AccordionItemHeading style={{position: 'relative'}}>
                            <AccordionItemButton>
                                <div style={style}>
                                    <img  style={{width: '50px', height: '50px'}} src={l.img} alt=""/>{l.title}
                                </div>
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
