import React from 'react';
import { useEffect } from 'react';
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Image,
  Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loading';
import CheckoutSteps from '../components/CheckoutStep';
import { createOrder } from '../actions/orderAction';
import { CART_RESET } from '../constants/cartConstant';

const PlaceOrderScreen = () => {
  const { userInfo } = useSelector((state) => state.userLogin);

  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const cart = useSelector((state) => state.cart);
  const { loading, error, success, order } = useSelector(
    (state) => state.orderCreate
  );

  const { cartItems, shippingAddress, paymentType } = cart;

  const addDecimals = (num) => {
    return Math.round((Number(num) / 100) * 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cartItems.reduce((pre, item) => {
      return (pre = pre + item.price * item.qty);
    }, 0)
  );

  cart.shippingPrice = addDecimals(cart.itemsPrice > 1000 ? 0 : 100);

  cart.taxPrice = addDecimals(cart.itemsPrice * 0.16);

  cart.totalPrice =
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice);

  const dispatch = useDispatch();

  useEffect(() => {
    if (success && order) {
      dispatch({ type: CART_RESET });
      navigate(`/order/${order._id}`);
    }
  }, [success, order, navigate, dispatch]);

  const createOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentType: cart.paymentType,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row className='mb-4'>
        <Col>
          {loading && <Loader />}
          {error && <Message>{error}</Message>}
        </Col>
      </Row>
      {userInfo && (
        <Row>
          <Col md={8}>
            <Row>
              <Col>
                <h4>Name : {userInfo && userInfo.name}</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4>
                  Email :&nbsp;
                  <a href={`mailto:${userInfo && userInfo.email}`}>
                    {userInfo && userInfo.email}
                  </a>
                </h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4>
                  Address :&nbsp;
                  {shippingAddress.address}, {shippingAddress.city},{' '}
                  {shippingAddress.zipCode}, {shippingAddress.country}
                </h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4>
                  Payment Type :&nbsp;
                  {paymentType}
                </h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <ListGroup variant='flush'>
                  <ListGroupItem>
                    <Row>
                      <Col lg={1}>Image</Col>
                      <Col lg={6}>Name</Col>
                      <Col lg={3}>Price</Col>
                    </Row>
                  </ListGroupItem>

                  {cartItems.map((cartItem) => (
                    <ListGroupItem key={cartItem.product}>
                      <Row>
                        <Col lg={1}>
                          <Image
                            src={cartItem.image}
                            alt={cartItem.name}
                            fluid
                            width={65}
                          />
                        </Col>
                        <Col lg={6}>
                          <Link to={`/product/${cartItem.product}`}>
                            {cartItem.name}
                          </Link>
                        </Col>
                        <Col lg={3}>
                          {cartItem.price} x {cartItem.qty} = Rs{' '}
                          {cartItem.price * cartItem.qty}/-
                        </Col>
                      </Row>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          </Col>
          <Col md={4}>
            <ListGroup>
              <ListGroupItem>
                <Row>
                  <Col>
                    <h3>
                      Subtotal(
                      {cartItems.reduce(
                        (pre, item) => (pre = item.qty + pre),
                        0
                      )}
                      )
                    </h3>
                  </Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>
                    <h5>Products Price</h5>
                  </Col>
                  <Col>
                    <h5>Rs {cart.itemsPrice}/-</h5>
                  </Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>
                    <h5>Shipping</h5>
                  </Col>
                  <Col>
                    <h5>Rs {cart.shippingPrice}/-</h5>
                  </Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>
                    <h5>
                      Tax <span className='fw-light fs-6'>(16% GST)</span>
                    </h5>
                  </Col>
                  <Col>
                    <h5>Rs {cart.taxPrice}/-</h5>
                  </Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>
                    <h4>Total</h4>
                  </Col>
                  <Col>
                    <h4>
                      <strong>Rs {cart.totalPrice}/-</strong>
                    </h4>
                  </Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col className='d-grid'>
                    <Button onClick={createOrderHandler}>Place Order</Button>
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
      )}
    </>
  );
};

export default PlaceOrderScreen;
