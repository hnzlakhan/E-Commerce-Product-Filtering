import axios from 'axios';
import {
  CART_ADD_ITEM,
  CART_ADD_PAYMENT,
  CART_ADD_SHIPPING,
  CART_REMOVE_ITEM,
} from '../constants/cartConstant';

export const addCartItem = (id, qty) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);
    const cartItem = {
      name: data.name,
      price: data.price,
      image: data.image,
      qty: Number(qty),
      countInStock: data.countInStock,
      product: data._id,
    };
    dispatch({ type: CART_ADD_ITEM, payload: cartItem });
    let cartItems = getState().cart.cartItems;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  } catch (error) {
    console.log(error);
  }
};

export const removeCartItem = (id) => async (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM, payload: id });
  let cartItems = getState().cart.cartItems;
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

export const addShippingAddress = (shipingAddress) => (dispatch, getState) => {
  dispatch({ type: CART_ADD_SHIPPING, payload: shipingAddress });
  let { shippingAddress } = getState().cart;
  localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
};

export const addPaymentType = (payment) => (dispatch, getState) => {
  dispatch({ type: CART_ADD_PAYMENT, payload: payment });
  let { paymentType } = getState().cart;
  localStorage.setItem('paymentType', JSON.stringify(paymentType));
};
