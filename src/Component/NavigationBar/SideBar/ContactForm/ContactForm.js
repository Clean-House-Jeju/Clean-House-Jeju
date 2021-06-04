import React from 'react';
import './ContactForm.css';
import {Card} from "react-bootstrap";

export default function ContactForm() {
    return (
        <Card className='contact-form-card'>
            <Card.Body className='contact-form-card-body'>
                <div>
                    <Card.Title>{'📞 제주시 생활환경과'}</Card.Title>
                    <Card.Text>
                        <a href='tel:064-728-3181'>제주시 생활환경과 (064-728-3181)</a>
                    </Card.Text>
                </div>
                <div>
                    <Card.Title>{'📧 개발자 이메일'}</Card.Title>
                    <Card.Text>
                        <a href="mailto:kunshup2000@gmail.com">kunshup2000@gmail.com</a>
                    </Card.Text>
                </div>
            </Card.Body>
        </Card>
    );
}
