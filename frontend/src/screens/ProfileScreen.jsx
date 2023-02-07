import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Row, Col, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Message from '../components/Message';
import Loader from '../components/Loading';
import FormContainer from '../components/FormContainer';
import { deleteUser, logout, updateUserProfile } from '../actions/userAction';
import { getOrderList } from '../actions/orderAction';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const { loading, success, error } = useSelector(
    (state) => state.userUpdateProfile
  );

  const orderList = useSelector((state) => state.orderList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderList;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      dispatch(getOrderList());
    }
  }, [userInfo, navigate, dispatch]);


  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Password not match');
    } else {
      setMessage(null);
      dispatch(updateUserProfile({ name, password }));
    }
  };
  
  const navigation = useNavigate();
 const logoutHandler = () => {
    dispatch(logout());
    navigation("/login");
  };
  return (
    <Row className='pt-3 '>
      <Col md={10} className='mx-auto'>
        {error ? <Message variant='danger'>{error}</Message> : null}
        {message ? <Message variant='danger'>{message}</Message> : null}
        {success ? <Message variant='success'>Profile updated!</Message> : null}
        {loading ? <Loader /> : null}
        <FormContainer title='User Profile' size={12}>
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className='mt-2'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value !== confirmPassword) {
                    setMessage('Password not match');
                  } else {
                    setMessage(null);
                  }
                }}
              ></Form.Control>
            </Form.Group>
            <Form.Group className='mt-2'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter confirm password'
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value !== password) {
                    setMessage('Password not match');
                  } else {
                    setMessage(null);
                  }
                }}
              ></Form.Control>
            </Form.Group>
            <div className='d-grid mt-3'>
              <Button type='submit' className='btn btn-success'>
                Update Profile
              </Button>
            </div>
            
          </Form>
        </FormContainer>
        <Link to={`logout`}>
          <div className='d-grid delete_btn'>
              <Button type='submit' className='btn btn-primary' onClick={() => {
              dispatch(deleteUser(userInfo._id));
              dispatch(logoutHandler);
                          }}>
               Delete Profile
              </Button>
          </div>
          </Link>
      </Col>
      {/* <Col md={8}>
        <FormContainer title='Orders' size={12}>
          {loadingOrders ? (
            <Loader />
          ) : errorOrders ? (
            <Message variant='danger'>{errorOrders}</Message>
          ) : (
            <div className='table-responsive'>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Delivered</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <FontAwesomeIcon
                            icon={faTimes}
                            style={{ color: 'red' }}
                          />
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <FontAwesomeIcon
                            icon={faTimes}
                            style={{ color: 'red' }}
                          />
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className='btn-sm' variant='light'>
                            Details
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </FormContainer>
      </Col> */}
    </Row>
  );
};

export default ProfileScreen;
