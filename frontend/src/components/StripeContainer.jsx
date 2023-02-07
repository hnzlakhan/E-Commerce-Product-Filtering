import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeForm from './StripeForm';

const StripeContainer = () => {
  const stripePromise = loadStripe(
    'pk_test_51L7wc6BV3tpomjDidT9HERhCNaSPWdHgZhAZojr4pnKkHAL4MhDzy9VyqbNK5OKV07hamPhSBvShQhbpewnZYP2C00fx9jOysf'
  );
  return (
    <Elements stripe={stripePromise}>
      <StripeForm />
    </Elements>
  );
};

export default StripeContainer;
