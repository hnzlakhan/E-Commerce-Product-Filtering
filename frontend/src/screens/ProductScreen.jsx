

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import Loading from "../components/Loading";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetail } from "../actions/productAction";

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, product } = useSelector(
    (state) => state.productDetail
  );

  useEffect(() => {
    dispatch(getProductDetail(id));
  }, [id, dispatch]);

  const backHandler = () => {
    navigate(-1);
  };

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          <Button onClick={backHandler}>Back</Button>
        </Col>
      </Row>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        product && (
          <Row>
            <Col md={5}>
              <Image src={product.image} fluid alt={product.name} />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    text={` from ${product.numReviews} users`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4>{product.category}</h4>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4>{product.fabric}</h4>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4 className="text-capitalize">
                    Available in {product.color}
                  </h4>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p>{product.description}</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <h4>Price</h4>
                    </Col>
                    <Col>
                      <h4>Rs {product.price}/-</h4>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <h4>Stock</h4>
                    </Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">Available</Badge>
                      ) : (
                        <Badge bg="danger">Out of stock</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <h4>Quantity</h4>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Select
                          value={qty}
                          disabled={product.countInStock === 0}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map(
                            (value) =>
                              value < 5 && (
                                <option key={value} value={value + 1}>
                                  {value + 1}
                                </option>
                              )
                          )}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        )
      )}
    </>
  );
};

export default ProductScreen;

