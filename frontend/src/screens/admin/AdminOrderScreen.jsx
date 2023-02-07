
import React from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import SideMenu from '../../components/SideMenu';
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getOrderList } from '../../actions/orderAction';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loading';
import Message from '../../components/Message';

const AdminOrderScreen = () => {
   const orderList = useSelector((state) => state.orderList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderList;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
    const [name, setName] = useState('');
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
  
  
  return(
    <>
    <SideMenu/>
    <Container fluid className='pt-3'>
      <Row>
         <Col md={12}>
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
                    {/* <th>Delivered</th> */}
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
                      {/* <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <FontAwesomeIcon
                            icon={faTimes}
                            style={{ color: 'red' }}
                          />
                        )}
                      </td> */}
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
      </Col>
</Row>
</Container>
    </>
  )
  

};

export default AdminOrderScreen;
