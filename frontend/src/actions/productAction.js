import axios from 'axios';
import {
  PRODUCT_DETAIL_FAIL,
  PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_EDIT_FAIL,
  PRODUCT_EDIT_REQUEST,
  PRODUCT_EDIT_SUCCESS,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
} from '../constants/productConstant';

export const getProductList = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data } = await axios.get('/api/products');
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    dispatch({ type: PRODUCT_LIST_FAIL, payload: errorMessage });
  }
};

export const getProductDetail = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAIL_REQUEST });
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch({ type: PRODUCT_DETAIL_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    dispatch({ type: PRODUCT_DETAIL_FAIL, payload: errorMessage });
  }
};


export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });
    let { userInfo } = getState().userLogin;
    if (!userInfo) {
      throw new Error('You are not logged in');
    }
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post('/api/products', {}, config);
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    dispatch({ type: PRODUCT_CREATE_FAIL, payload: errorMessage });
  }
};

export const editProduct = (id, product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_EDIT_REQUEST });
    let { userInfo } = getState().userLogin;
    if (!userInfo) {
      throw new Error('You are not logged in');
    }
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.put(`/api/products/${id}`, product, config);
    dispatch({ type: PRODUCT_EDIT_SUCCESS });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    dispatch({ type: PRODUCT_EDIT_FAIL, payload: errorMessage });
  }
};

export const searchProducts = data => dispatch => {
  axios.post('/api/products/search-products', data)
    .then(response => {
      localStorage.setItem('searchedProducts', JSON.stringify(response.data.allProducts));
    })
    .catch(error => {
      console.log({ error });
    });
};




export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST });
    let { userInfo } = getState().userLogin;
    if (!userInfo) {
      throw new Error('You are not logged in');
    }
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.delete(`/api/products/${id}`, config);
    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    dispatch({ type: PRODUCT_DELETE_FAIL, payload: errorMessage });
  }
};
