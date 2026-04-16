import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user
    }
  });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedName = name?.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    // Check if user exists
    const existingUser = await User.findByEmail(trimmedEmail);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      id: uuidv4(),
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      role: 'user'
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findByEmail(trimmedEmail);

    if (!user) {
      console.log(`🔍 Login Failed: User not found for email: ${trimmedEmail}`);
      return res.status(401).json({ success: false, message: 'Incorrect email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`❌ Login Failed: Password mismatch for email: ${trimmedEmail}`);
      return res.status(401).json({ success: false, message: 'Incorrect email or password' });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, gender, pan_card, gift_card_balance } = req.body;
    let pan_image = req.user.pan_image;

    if (req.file) {
      pan_image = `/uploads/pan/${req.file.filename}`;
    }

    const updatedUser = await User.update(req.user.id, { 
      name, 
      phone, 
      gender, 
      pan_card, 
      gift_card_balance,
      pan_image
    });

    res.status(200).json({
      success: true,
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};
