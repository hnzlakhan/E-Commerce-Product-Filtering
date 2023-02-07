

import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="product-card">
   <Link to={`/product/${product._id}`}>
        <Card.Img variant="top" src={product.image} alt={product.name} />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>
            <Rating
              rating={product.rating}
              text={` from ${product.numReviews} users`}
            />
          </Card.Text>
        </Card.Body>
      </Link>
    </Card>
  );
};

export default Product;
