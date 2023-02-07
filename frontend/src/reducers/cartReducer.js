import {
  CART_ADD_ITEM,
  CART_ADD_PAYMENT,
  CART_ADD_SHIPPING,
  CART_REMOVE_ITEM,
  CART_RESET,
} from '../constants/cartConstant';

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const exist = state.cartItems.find((x) => x.product === item.product);
      if (exist) {
        return {
          ...state,
          cartItems: state.cartItems.map((p) =>
            p.product === item.product ? item : p
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case CART_REMOVE_ITEM:
      const productId = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.filter((p) => p.product !== productId),
      };
    case CART_ADD_SHIPPING:
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case CART_ADD_PAYMENT:
      return {
        ...state,
        paymentType: action.payload,
      };
    case CART_RESET:
      return { cartItems: [] };
    default:
      return state;
  }
};
