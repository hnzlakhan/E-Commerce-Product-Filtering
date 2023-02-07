import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import { Col, Row } from 'react-bootstrap';
import Loading from '../components/Loading';
import Message from '../components/Message';
import { getProductList } from '../actions/productAction';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProductDisplay = () => {
  const productList = useSelector((state) => state.productList);
  const { products, loading, error } = productList;

  const [searchProd, setSearchProd] = useState('');


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchHandler = () => {
    if (searchProd) {
      navigate(`/search-products?search=${searchProd}`);
    }
  };



  useEffect(() => {
    dispatch(getProductList());
  }, [dispatch]);



  return (
    <>
      <Form className='mb-5'>
        <fieldset>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="searchProduct">Search Product</Form.Label>
            <Form.Control id="searchProduct" placeholder="Enter Product Name" onChange={e => setSearchProd(e.target.value)} />
          </Form.Group>
          <Button onClick={searchHandler} >Search</Button>
        </fieldset>
      </Form>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message>{error}</Message>
      ) : products.length > 0 ? (
        <Row>
          {products.map((product) => (
            <Col lg={3} md={4} sm={6} key={product._id} className='mb-4'>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      ) : (
        <p>No product found</p>
      )}


    </>
  );
};

export default ProductDisplay;
