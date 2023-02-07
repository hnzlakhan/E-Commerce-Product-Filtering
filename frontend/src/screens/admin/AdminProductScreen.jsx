import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/Loading';
import Message from '../../components/Message';
import SideMenu from '../../components/SideMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
  faPlus,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import { createProduct, deleteProduct, getProductList } from '../../actions/productAction';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_CREATE_RESET } from '../../constants/productConstant';
const AdminProductScreen = () => {
  const navigate = useNavigate();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      navigate(`/admin/products/${createdProduct._id}/edit`);
    } else {
      dispatch(getProductList());
    }
  }, [successCreate, navigate, dispatch, createdProduct]);

  const createProductHandler = () => {
    // dispatch create prodcut
    dispatch(createProduct());
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/${id}/edit`);
  };

  
  return (
    <>
      <SideMenu />
      <Container fluid className='pt-3'>
        <Row>
          <Col>
            <Button className='my-3 float-end' onClick={createProductHandler}>
              <FontAwesomeIcon icon={faPlus} /> Create Product
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.category}</td>
                      <td>
                        <Button
                          variant='danger'
                          
                          className='btn-sm mb-2'
                          onClick={() => {
                         dispatch(deleteProduct(product._id));
                          
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} onClick />
                         
                        </Button>
                        &nbsp;
                     
                        <Button
                          variant='success'
                          
                          className='btn-sm mb-2'
                          onClick={() => {
                          handleEdit(product._id);
                          
                          }}
                        >
                          <FontAwesomeIcon icon={faPencilAlt}  />
                         
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminProductScreen;
