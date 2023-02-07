import React from "react";
import { Row, Col, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faAddressCard,
  faCreditCard,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";

const CheckoutStep = ({ step1, step2, step3, step4 }) => {
  return (
    <Row className="justify-content-md-center">
      <Col md={8}>
        <Nav className="justify-content-between" activeKey="/home">
          {step1 ? (
            <LinkContainer to="/login">
              <Nav.Item>
                <Nav.Link>
                  <FontAwesomeIcon icon={faUser} /> Login
                </Nav.Link>
              </Nav.Item>
            </LinkContainer>
          ) : (
            <Nav.Item>
              <Nav.Link disabled>
                <FontAwesomeIcon icon={faUser} /> Login
              </Nav.Link>
            </Nav.Item>
          )}
          {step2 ? (
            <LinkContainer to="/shipping">
              <Nav.Item>
                <Nav.Link>
                  <FontAwesomeIcon icon={faAddressCard} /> Shipping Address
                </Nav.Link>
              </Nav.Item>
            </LinkContainer>
          ) : (
            <Nav.Item>
              <Nav.Link disabled>
                <FontAwesomeIcon icon={faAddressCard} /> Shipping Address
              </Nav.Link>
            </Nav.Item>
          )}
          {step3 ? (
            <LinkContainer to="/payment">
              <Nav.Item>
                <Nav.Link>
                  <FontAwesomeIcon icon={faCreditCard} /> Payment
                </Nav.Link>
              </Nav.Item>
            </LinkContainer>
          ) : (
            <Nav.Item>
              <Nav.Link disabled>
                <FontAwesomeIcon icon={faCreditCard} /> Payment
              </Nav.Link>
            </Nav.Item>
          )}
          {step4 ? (
            <LinkContainer to="/checkout">
              <Nav.Item>
                <Nav.Link>
                  <FontAwesomeIcon icon={faTruckFast} /> Checkout
                </Nav.Link>
              </Nav.Item>
            </LinkContainer>
          ) : (
            <Nav.Item>
              <Nav.Link disabled>
                <FontAwesomeIcon icon={faTruckFast} /> Checkout
              </Nav.Link>
            </Nav.Item>
          )}
        </Nav>
      </Col>
    </Row>
  );
};

export default CheckoutStep;
