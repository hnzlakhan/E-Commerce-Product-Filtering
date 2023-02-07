import Order from '../models/order.js';
import Product from '../models/product.js';
import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import { isAdmin } from '../middlewares/authHandler.js';

//  Path    :   POST: /api/orders
//  Desc    :   Create new order
//  Secure  :   Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentType,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingAddress,
    paymentType,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    user: req.user._id,
  });

  res.json({ _id: order._id });
});

//  Path    :   GET: /api/orders
//  Desc    :   Get loggedIn user orders
//  Secure  :   Private
export const getOrders = asyncHandler(async (req, res) => {
  let orders = await Order.find({});
  res.json(orders);
});

//  Path    :   GET: /api/orders/:id
//  Desc    :   Get order by Id
//  Secure  :   Private
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let order = await Order.findById(id).populate('user', 'name email');
  if (order) {
    if (
      order.user._id.toString() === req.user._id.toString() ||
      req.user.isAdmin
    ) {
      res.json(order);
    } else {
      res.statusCode = 403;
      throw new Error("You don't have access to this order.");
    }
  } else {
    res.statusCode = 404;
    throw new Error('Order not found!');
  }

  let orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

const removeCartItemFromStock = async (id, qty) => {
  try {
    let product = await Product.findById(id);
    if (product) {
      let currentStock = product.countInStock - qty;
      if (currentStock < 0) {
        currentStock = 0;
      }
      product.countInStock = currentStock;
      await product.save();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

//  Path    :   POST: /api/orders/:id/pay
//  Desc    :   pay new order
//  Secure  :   Private
export const payOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let order = await Order.findById(id).populate('user', 'name');
  if (order) {
    const paymentMethod = req.body;
    /// create payment on stripe
    order.paymentMethod = paymentMethod;
    const stripe = new Stripe(
      'sk_test_51L7wc6BV3tpomjDimATVjc215VdUE98dG9blYbP352MeSpvFXgzSxQ3YzLtEAaTGhRWY5f9fvJBIIvITnvGgd4L800bfkTY1gI'
    );

    await stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      currency: 'PKR',
      amount: order.totalPrice * 100,
      description: `${order.user.name} has ordered items.`,
      confirm: true,
      metadata: {
        orderId: order._id,
      },
    });

    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();
    order.orderItems.forEach(async (orderItem) => {
      await removeCartItemFromStock(orderItem.product, orderItem.qty);
    });
    res.statusCode = 200;
    res.json({});
  } else {
    res.statusCode = 404;
    throw new Error('Order not found!');
  }
});
