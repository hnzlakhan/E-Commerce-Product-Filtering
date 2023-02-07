import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import Message from './Message';
import Loading from './Loading';
import { payOrder } from '../actions/orderAction';

const StripeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { loading: payLoading, error: payError } = useSelector(
    (state) => state.orderPay
  );

  const { order } = useSelector((state) => state.orderDetail);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (elements == null) {
      return;
    }
    setLoading(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
    });

    console.log(error);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (paymentMethod) {
      let {
        id,
        card: { brand, last4 },
      } = paymentMethod;
      dispatch(payOrder(order._id, { id, brand, last4 }));
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {(loading || payLoading) && <Loading />}
      {error && <Message>{error}</Message>}
      {payError && <Message>{payError}</Message>}
      <Form.Group className='mb-2'>
        <Form.Label>Card Number</Form.Label>
        <CardNumberElement className='form-control' />
      </Form.Group>
      <Form.Group className='mb-2'>
        <Form.Label>Card Expiry</Form.Label>
        <CardExpiryElement className='form-control' />
      </Form.Group>
      <Form.Group className='mb-2'>
        <Form.Label>Card CVC</Form.Label>
        <CardCvcElement className='form-control' />
      </Form.Group>
      <div className='d-grid my-3'>
        <Button type='submit' disabled={!stripe || !elements}>
          Pay
        </Button>
      </div>
    </Form>
  );
};

export default StripeForm;
