import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutStep';
import FormContainer from '../components/FormContainer';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addPaymentType } from '../actions/cartAction';

const PaymentScreen = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const { paymentType } = useSelector((state) => state.cart);
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const [payment, setPayment] = useState(paymentType ? paymentType : 'Stripe');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigation('/login');
    }
  }, [userInfo, navigation]);
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity()) {
      dispatch(addPaymentType(payment));
      navigation('/placeorder');
    }
  };
  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer title='Payment Type'>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Check type='radio' id='stripe'>
            <Form.Check.Input
              type='radio'
              name='paymentType'
              value='Stripe'
              checked={payment === 'Stripe'}
              onChange={(e) => setPayment(e.target.value)}
            />
            <Form.Check.Label>Stripe</Form.Check.Label>
          </Form.Check>
          <Form.Check type='radio' id='paypal'>
            <Form.Check.Input type='radio' name='paymentType' disabled />
            <Form.Check.Label>Paypal</Form.Check.Label>
          </Form.Check>

          <Button type='submit' className='float-end'>
            Continue <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
