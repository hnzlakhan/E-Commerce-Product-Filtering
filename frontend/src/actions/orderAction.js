import axios from 'axios';
import {
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DETAIL_REQUEST,
  ORDER_DETAIL_SUCCESS,
  ORDER_DETAIL_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,

} from '../constants/orderConstant';
import { logout } from './userAction';

export const getOrderList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST });
    const { token } = getState().userLogin.userInfo;

    let config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get('/api/orders', config);
    dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    dispatch({ type: ORDER_LIST_FAIL, payload: errorMessage });
  }
};


export const getOrderDetail = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAIL_REQUEST });
    const { token } = getState().userLogin.userInfo;

    let config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`/api/orders/${id}`, config);
    dispatch({ type: ORDER_DETAIL_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    dispatch({ type: ORDER_DETAIL_FAIL, payload: errorMessage });
  }
};

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    const { token } = getState().userLogin.userInfo;

    dispatch({ type: ORDER_CREATE_REQUEST });

    let config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(`/api/orders`, order, config);
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
  } catch (error) {
    console.log(error.response);
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    if (error.response && error.response.status === 401) {
      setTimeout(() => {
        dispatch(logout());
      }, 2000);
    }
    dispatch({ type: ORDER_CREATE_FAIL, payload: errorMessage });
  }
};

export const payOrder = (id, paymentMethod) => async (dispatch, getState) => {
  try {
    const { token } = getState().userLogin.userInfo;

    dispatch({ type: ORDER_PAY_REQUEST });

    let config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.post(`/api/orders/${id}/pay`, paymentMethod, config);
    dispatch({ type: ORDER_PAY_SUCCESS });
  } catch (error) {
    console.log(error.response);
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    if (error.response && error.response.status === 401) {
      setTimeout(() => {
        dispatch(logout());
      }, 2000);
    }
    dispatch({ type: ORDER_PAY_FAIL, payload: errorMessage });
  }
};
