import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faTachometerAlt,
  faCubes,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
const SideMenu = () => {
  return (
    <ListGroup className='side-nav'>
      <Link to='/admin'>
        <ListGroup.Item>
          <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
        </ListGroup.Item>
      </Link>
      <LinkContainer to='/admin/products'>
        <ListGroup.Item>
          <FontAwesomeIcon icon={faCubes} /> Products
        </ListGroup.Item>
      </LinkContainer>
      <LinkContainer to='/admin/orders'>
        <ListGroup.Item>
          <FontAwesomeIcon icon={faShoppingCart} /> Orders
        </ListGroup.Item>
      </LinkContainer>
      <LinkContainer to='/admin/users'>
        <ListGroup.Item>
          <FontAwesomeIcon icon={faUsers} /> Users
        </ListGroup.Item>
      </LinkContainer>
    </ListGroup>
  );
};

export default SideMenu;
