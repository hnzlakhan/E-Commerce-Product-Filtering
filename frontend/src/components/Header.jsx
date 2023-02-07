import React from "react";
import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userAction";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const cart = useSelector((state) => state.cart);
  const productCount = cart.cartItems.reduce((pre, next) => {
    return (pre += next.qty);
  }, 0);

  const { userInfo } = useSelector((state) => state.userLogin);

  const dispatch = useDispatch();

  const navigation = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigation("/login");
  };

  return (
    <header >
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Product Filtering</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  &nbsp;Cart <Badge bg="secondary">{productCount}</Badge>
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="collasible-nav-dropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  {userInfo.isAdmin && (
                    <LinkContainer to="/admin">
                      <NavDropdown.Item>Admin</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FontAwesomeIcon icon={faUser} />
                    &nbsp;Login
                  </Nav.Link>
                </LinkContainer>
              )}
           
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
