import User from '../models/user.js';
import asyncHandler from 'express-async-handler';

//  Path    :   /api/users/login
//  Desc    :   Login user and return token
//  Secure  :   Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    res.statusCode = 404;
    throw new Error('Invalid email or password');
  }

  if (!(await user.ComparePassword(password))) {
    res.statusCode = 400;
    throw new Error('Invalid email or password');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: user.GenerateToken(),
  });
});

//  Path    :   /api/users/register
//  Desc    :   Register user and return token
//  Secure  :   Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const createdUser = await User.create({
    name,
    email,
    password,
  });

  res.json({
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    isAdmin: createdUser.isAdmin,
    token: createdUser.GenerateToken(),
  });
});

//  Path    :   /api/users/profile
//  Desc    :   Get loggedIn user profile
//  Secure  :   Private
export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  });
});

//  Path    :   /api/users/profile
//  Desc    :   update loggedIn user profile
//  Secure  :   Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  let user = await User.findById(req.user._id);

  user.name = name || user.name;

  if (user) {
    user.name = req.body.name || user.name
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: updatedUser.GenerateToken(updatedUser._id),
    })
  }
});
export const getAllProfiles = asyncHandler(async (req, res) => {

  let users = await User.find({})
  
 res.json(users);
  
});

export const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id
  const users = await User.findByIdAndDelete(id);

});
