import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutStep';
import FormContainer from '../components/FormContainer';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addShippingAddress } from '../actions/cartAction';

const ShippingScreen = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const { shippingAddress } = useSelector((state) => state.cart);
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const [address, setAddress] = useState(
    shippingAddress ? shippingAddress.address : ''
  );
  const [city, setCity] = useState(shippingAddress ? shippingAddress.city : '');
  const [zipCode, setZipCode] = useState(
    shippingAddress ? shippingAddress.zipCode : ''
  );
  const [country, setCountry] = useState(
    shippingAddress ? shippingAddress.country : ''
  );
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
      dispatch(
        addShippingAddress({
          address,
          city,
          zipCode,
          country,
        })
      );
      navigation('/payment');
    }
  };
  return (
    <>
      <CheckoutSteps step1 step2 />
      <FormContainer title='Shipping Address'>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId='address' className='mb-2'>
            <Form.Label>Street Address</Form.Label>
            <Form.Control
              required
              type='text'
              placeholder='Street Address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Form.Control.Feedback type='invalid'>
              Street Address is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='city' className='mb-2'>
            <Form.Label>City</Form.Label>
            <Form.Control
              required
              type='text'
              placeholder='City'
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Form.Control.Feedback type='invalid'>
              City is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='zipcode' className='mb-2'>
            <Form.Label>Zip Code</Form.Label>
            <Form.Control
              required
              type='text'
              placeholder='Zip code'
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
            <Form.Control.Feedback type='invalid'>
              Zipcode is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='country' className='mb-3'>
            <Form.Label>Country</Form.Label>
            <Form.Control
              required
              type='text'
              placeholder='Country'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <Form.Control.Feedback type='invalid'>
              Country is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Button type='submit' className='float-end'>
            Continue <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
