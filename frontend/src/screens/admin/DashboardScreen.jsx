import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import SideMenu from '../../components/SideMenu';


const DashboardScreen = () => {
  const [product, setProduct] = useState([]);
  const [user, setUser] = useState([]);
  const [order, setOrder] = useState([]);
  useEffect(() => {
    const productss = async () => {
      const { data } = await axios.get('/api/products')
      setProduct(data);
    }
    productss();
  }, []);
  
  useEffect(() => {
    const useris = async () => {
      const { data } = await axios.get('/api/users/profiles')
      setUser(data);
    }
    useris();
  },[])

  useEffect(() => {
    const orderis =async () => {
   
      const { data } = await axios.get('/api/orders' );
      setOrder(data);
    }
    orderis();
},[])
  return (
    <>
      <SideMenu />
      <Container fluid className='pt-3'>
        <Row>
          <Col md={6}>
            <Card className='bg-light'>
              <LinkContainer to='/admin/products'>
                <Card.Body>
                  <Card.Title>Products</Card.Title>
                  <Card.Text className='text-center display-4'>{ product.length}</Card.Text>
                </Card.Body>
              </LinkContainer>
            </Card>
          </Col>
          {/* <Col md={4}>
            <Card className='bg-light'>
              <LinkContainer to='/admin/orders'>
                <Card.Body>
                  <Card.Title>Orders</Card.Title>
                  <Card.Text className='text-center display-4'>{ order.length}</Card.Text>
                </Card.Body>
              </LinkContainer>
            </Card>
          </Col> */}
          <Col md={6}>
            <Card className='bg-light'>
              <LinkContainer to='/admin/users'>
                <Card.Body>
                  <Card.Title>Users</Card.Title>
                  <Card.Text className='text-center display-4'>{ user.length}</Card.Text>
                </Card.Body>
              </LinkContainer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DashboardScreen;
