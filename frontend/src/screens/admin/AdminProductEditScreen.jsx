import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { editProduct, getProductDetail } from '../../actions/productAction';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loading';
import Message from '../../components/Message';
import { PRODUCT_EDIT_RESET } from '../../constants/productConstant';
import axios from 'axios';
import { logout } from '../../actions/userAction';

const AdminProductEditScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [fabric, setFabric] = useState('');
  const [color, setColor] = useState('');
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [validated, setValidated] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const { id } = useParams();

  const navigation = useNavigate();
  const { loading, product, error } = useSelector(
    (state) => state.productDetail
  );

  const {
    loading: editLoading,
    success,
    error: editError,
  } = useSelector((state) => state.productEdit);

  const { userInfo } = useSelector((state) => state.userLogin);

  const dispatch = useDispatch();
  useEffect(() => {
    if (success) {
      dispatch({ type: PRODUCT_EDIT_RESET });
      navigation('/admin/products');
    }
    dispatch(getProductDetail(id));
  }, [dispatch, id, success, navigation]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setCategory(product.category);
      setColor(product.color);
      setFabric(product.fabric);
      setCountInStock(product.countInStock);
      setImage(product.image);
      setDescription(product.description);
    }
  }, [product]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity()) {
      dispatch(
        editProduct(product._id, {
          name,
          price,
          category,
          color,
          fabric,
          image,
          countInStock,
          description,
        })
      );
    }
  };

  const handleImageChange = async (e) => {
    let [image] = e.target.files;
    let formData = new FormData();
    formData.append('image', image);
    try {
      const { token } = userInfo;

      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      setUploadLoading(true);
      setUploadError(null);
      const { data } = await axios.post(`/api/uploads`, formData, config);
      // set image in start
      setImage(data.fileName);
      setUploadLoading(false);
    } catch (error) {
      debugger;
      const errorMessage = error.response
        ? error.response.data.message
        : error.message;
      if (error.response && error.response.status === 401) {
        setTimeout(() => {
          dispatch(logout());
        }, 2000);
      }
      setUploadLoading(false);
      setUploadError(errorMessage);
      // set image error
    }
  };
  const navigate = useNavigate();
  const backHandler = () => {
    navigate(-1);
  };
  return (
    <>
      <Row className="mx-3">
        <Col>
          <Button onClick={backHandler}>Back</Button>
        </Col>
      </Row>
    <div className='mb-3'>
      <FormContainer title='Edit Product'>
        {(loading || editLoading || uploadLoading) && <Loader />}
        {error && <Message>{error}</Message>}
        {editError && <Message>{editError}</Message>}
        {uploadError && <Message>{uploadError}</Message>}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId='name' className='mb-2'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type='text'
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Control.Feedback type='invalid'>
              Name is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='price' className='mb-2'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              required
              type='number'
              placeholder='Price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Form.Control.Feedback type='invalid'>
              Price is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='category' className='mb-2'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              required
              type='text'
              placeholder='Category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Form.Control.Feedback type='invalid'>
              Category is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='fabric' className='mb-2'>
            <Form.Label>Made of</Form.Label>
            <Form.Control
              required
              type='text'
              placeholder='Fabric'
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
            />
            <Form.Control.Feedback type='invalid'>
             Made of is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='color' className='mb-2'>
            <Form.Label>Color</Form.Label>
            <Form.Control
              required
              type='text'
              placeholder='Color'
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <Form.Control.Feedback type='invalid'>
              Color is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='image' className='mb-2'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              required
              type='text'
              placeholder='Image URL'
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <Form.Control type='file' onChange={handleImageChange} />
            <Form.Control.Feedback type='invalid'>
              Image is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='countInStock' className='mb-2'>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              required
              type='number'
              placeholder='Count In Stock'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
            <Form.Control.Feedback type='invalid'>
              Image is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='description' className='mb-2'>
            <Form.Label>Description</Form.Label>

            <Form.Control
              as='textarea'
              rows={3}
              required
              type='text'
              placeholder='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Form.Control.Feedback type='invalid'>
              Description is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Button type='submit'>Save</Button>
        </Form>
      </FormContainer>
      </div>
      </>
  );
};

export default AdminProductEditScreen;
