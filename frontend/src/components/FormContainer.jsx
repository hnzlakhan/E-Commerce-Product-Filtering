import { Container, Row, Col, Card } from 'react-bootstrap';
import React from 'react';
const FormContainer = ({ title, size, children }) => {
  if (!size) {
    size = 6;
  }
  return (
    <Container>
      <Row className='justify-content-md-center pt-3'>
        <Col md={size} xs={12}>
          {title ? (
            <Card>
              <Card.Body>
                <Card.Title as='h2' className='text-center'>
                  {title}
                </Card.Title>
                <hr />
                {children}
              </Card.Body>
            </Card>
          ) : (
            children
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
