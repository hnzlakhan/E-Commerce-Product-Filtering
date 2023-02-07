import axios from 'axios';
import { CART_RESET } from '../constants/cartConstant';
import { ORDER_CREATE_RESET } from '../constants/orderConstant';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_LOGOUT,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_REQUEST,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,

} from '../constants/userConstant';

export const login = (email, password) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    let config = {
      Headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    );
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    let info = getState().userLogin.userInfo;
    localStorage.setItem('userInfo', JSON.stringify(info));
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    dispatch({ type: USER_LOGIN_FAIL, payload: errorMessage });
  }
};

export const register =
  (name, email, password) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_REGISTER_REQUEST });
      let config = {
        Headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        `/api/users/register`,
        { name, email, password },
        config
      );
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      let info = getState().userLogin.userInfo;
      localStorage.setItem('userInfo', JSON.stringify(info));
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : error.message;
      dispatch({ type: USER_REGISTER_FAIL, payload: errorMessage });
    }
  };

export const logout = () => async (dispatch) => {
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: CART_RESET });
  dispatch({ type: ORDER_CREATE_RESET });
  localStorage.clear();
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put('/api/users/profile', user, config);
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS });

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};




export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });
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
    await axios.delete(`/api/users/${id}`, config);
    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    dispatch({ type: USER_DELETE_FAIL, payload: errorMessage });
  }
};