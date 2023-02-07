import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Form, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loading';
import Message from '../components/Message';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigate();
  const [query] = useSearchParams();
  const redirect = query.get('redirect') === null ? '/' : query.get('redirect');
  const { loading, error, userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (userInfo) {
      if (redirect.includes('admin')) {
        if (userInfo.isAdmin) {
          navigation(redirect);
        }
      } else {
        navigation(redirect);
      }
    }
  }, [userInfo, navigation]);

  let dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch login
    dispatch(login(email, password));
  };
  return (
    <FormContainer title='Sign In'>
      {error && <Message>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-2'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='mb-2'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <div className='d-grid'>
          <Button type='submit' className='btn btn-primary mt-3'>
            Sign In
          </Button>
        </div>
      </Form>
      <Row className='py-3'>
        <Col>
          Not have an account?{' '}
          <Link
            to={
              redirect !== '/' ? `/register?redirect=${redirect}` : '/register'
            }
          >
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
