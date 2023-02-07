import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import {
  productCreateReducer,
  productDetailReducer,
  productEditReducer,
  productListReducer,
} from './reducers/productReducer';
import { cartReducer } from './reducers/cartReducer';
import {
  userLoginReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
} from './reducers/userReducer';
import {
  orderCreateReducer,
  orderDetailReducer,
  orderListReducer,

  orderPayReducer,
} from './reducers/orderReducer';

const reducers = combineReducers({
  productList: productListReducer,
  productDetail: productDetailReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userUpdateProfile: userUpdateProfileReducer,
  orderList: orderListReducer,
  orderDetail: orderDetailReducer,
  orderCreate: orderCreateReducer,
  orderPay: orderPayReducer,
  productCreate: productCreateReducer,
  productEdit: productEditReducer,
});

let cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

let userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : null;

const paymentTypeFromStorage = localStorage.getItem('paymentType')
  ? JSON.parse(localStorage.getItem('paymentType'))
  : null;

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentType: paymentTypeFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
};

const middlewares = [thunk];

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
