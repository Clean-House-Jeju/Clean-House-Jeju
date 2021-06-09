import React from 'react';
import './ContactForm.css';
import {Card} from "react-bootstrap";
import {list} from "./ContactData";

const ContactForm = React.memo(() =>{
    return (
        <Card className='contact-form'>
            <Card.Body className='contact-form-card-body'>
                {
                    list.map((l, i) => (
                        <div className='contact-form-card-content' key={i}>
                            <Card.Title>{l.title}</Card.Title>
                            <Card.Text>
                                <a href={l.href}>{l.info}</a>
                            </Card.Text>
                        </div>
                    ))
                }
            </Card.Body>
        </Card>
    );
});

export default ContactForm;
