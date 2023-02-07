import express from 'express';
import { authHandler } from '../middlewares/authHandler.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const checkFileType = (file, cb) => {
  const types = /jpg|jpeg|png/;
  const fileExt = path.extname(file.originalname).toLowerCase();
  const isValidType = types.test(fileExt);
  const isValidMime = types.test(file.mimetype);
  if (isValidType && isValidMime) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

const router = express.Router();

router.post('/', authHandler, upload.single('image'), (req, res) => {
  res.json({
    fileName: `/uploads/${req.file.filename}`,
  });
});

export default router;
