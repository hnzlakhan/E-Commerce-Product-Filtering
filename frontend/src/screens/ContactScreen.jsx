import { Button, Form,  } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useState } from 'react';

export const ContactScreen = event => {
  const form = useRef();
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Message, setMessage] = useState('');
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_mpkl9uj', 'template_hv2cs8r', form.current, 'wcYZLEqqRwdVFLlcY');
    setName('');
    setEmail('');
    setMessage('');
     
  };

  return (
    <>


           <FormContainer title="Contact">
 
         <form ref={form} onSubmit={sendEmail}>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
         <Form.Control
              type="text"
              required
              placeholder="Enter Your Name"
              name="user_name"
              onChange={event => setName(event.target.value)}
              value={Name}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
              type="email"
               required
            placeholder="Enter Email"
              name="user_email"
                onChange={event => setEmail(event.target.value)}
              value={Email}
          ></Form.Control>
        </Form.Group>
       
        <Form.Group className="mb-2">
            <Form.Label>Message</Form.Label>
            
          <Form.Control
              type="text"
              as='textarea'
              rows={4}
              required
            name="message"
          placeholder="Enter Your Message"
            onChange={event => setMessage(event.target.value)}
              value={Message}
          ></Form.Control>
          </Form.Group>
          <div className="d-grid">
          <Button type="submit" className="btn btn-primary mt-3" value="Send">
            Submit
          </Button>
        </div>
    </form>
        
      </FormContainer>
    
      
      </>
  );
};

export default ContactScreen;