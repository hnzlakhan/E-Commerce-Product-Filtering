import Product from '../models/product.js';
import SearchProduct from '../models/searchProduct.js';
import asyncHandler from 'express-async-handler';

import { flipkartBrowserConfiguration } from '../scrapper/flipkart.js';
import { darazBrowserConfiguration } from '../scrapper/daraz.js';
import { amazonBrowserConfiguration } from '../scrapper/amazon.js';

//  Path    :   /api/product
//  Desc    :   Get all products
//  Secure  :   Public
export const getProducts = asyncHandler(async (req, res) => {
  let products = await Product.find({});
  res.json(products);
});


export const getProductsBySearch = asyncHandler(async (req, res) => {
  const { search } = req.body;

  let finalProducts = [];

  let existingSearchedProducts;
  try {
    existingSearchedProducts = await SearchProduct.find({});
  } catch (error) {
    console.log({ error });
  }

  existingSearchedProducts.forEach(el => {
    if (el.productName.toLowerCase().includes(search.toLowerCase())) {
      finalProducts.push(el);
    }
  });

  if (finalProducts.length) {
    res.json({ allProducts: finalProducts });
  }
  else {
    let allProducts = [];


    // Flipkart
    let flipkartAllProducts;
    try {
      flipkartAllProducts = await Promise.resolve(flipkartBrowserConfiguration(search));
    } catch (error) {
      console.log({ error });
    };
    console.log({ flipkartAllProducts });

    // Amazon
    let amazonAllProducts;
    try {
      amazonAllProducts = await Promise.resolve(amazonBrowserConfiguration(search));
    } catch (error) {
      console.log({ error });
    };
    console.log({ amazonAllProducts });

    // Daraz
    let darazAllProducts;
    try {
      darazAllProducts = await Promise.resolve(darazBrowserConfiguration(search));
    } catch (error) {
      console.log({ error });
    };
    console.log({ darazAllProducts });

    darazAllProducts && darazAllProducts.forEach(product => allProducts.push(product));
    amazonAllProducts && amazonAllProducts.forEach(product => allProducts.push(product));
    flipkartAllProducts && flipkartAllProducts.forEach(product => allProducts.push(product));

    const selectedProds = Math.floor(Math.random() * (8 - 5 + 1) + 5) + 1;

    allProducts.sort((a, b) => +b.rating - +a.rating);
    allProducts.length = selectedProds;

    allProducts.forEach(async product => {
      const newSearchedProduct = new SearchProduct({
        productName: product.productName,
        price: product.price,
        imageURL: product.imageURL,
        productURL: product.productURL,
        rating: product.rating,
        reviews: JSON.stringify(product.reviews),
        tag: product.tag
      });

      try {
        await newSearchedProduct.save();
      } catch (error) {
        console.log({ error });
      }
    });

    res.json({ allProducts });
  }

});

//  Path    :   /api/product/:id
//  Desc    :   Get single product by id
//  Secure  :   Public
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (product) {
    return res.json(product);
  }
  res.statusCode = 404;
  throw new Error('Product not found');
});


//  Path    :   POST : /api/product
//  Desc    :   Get single product by id
//  Secure  :   Public
export const createProduct = asyncHandler(async (req, res) => {
  let product = new Product({
    name: 'Sample Product',
    image: '/images/no-image.jpg',
    description: 'Sample description',
    color: 'black',
    category: 'Boys',
    fabric: 'Sample',
    price: 0,
    countInStock: 0,
    rating: 0,
    numReviews: 0,
    user: req.user._id,
  });

  const newProduct = await product.save();
  return res.json({ _id: newProduct._id });
});

//  Path    :   PUT : /api/product/:id
//  Desc    :   Get single product by id
//  Secure  :   Public
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.statusCode = 404;
    throw new Error('Product not found');
  }

  let {
    name,
    price,
    category,
    color,
    fabric,
    image,
    countInStock,
    description,
  } = req.body;
  product.name = name;
  product.price = price;
  product.category = category;
  product.color = color;
  product.fabric = fabric;
  product.image = image;
  product.countInStock = countInStock;
  product.description = description;
  await product.save();
  res.json({});
});
export const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id
  const product = await Product.findByIdAndDelete(id);

});
