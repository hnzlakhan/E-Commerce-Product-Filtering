import express from 'express';
import {
  login,
  register,
  getProfile,
  updateProfile,
  getAllProfiles,
  deleteUser,
} from '../controllers/users.js';
import { authHandler } from '../middlewares/authHandler.js';

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/profile', authHandler, getProfile);

router.put('/profile', authHandler, updateProfile);

router.get('/profiles', getAllProfiles);


router.delete('/:id', authHandler, deleteUser);

export default router;
