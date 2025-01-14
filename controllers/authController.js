const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerSchema, loginSchema } = require('../validation/userValidation');

// Register a new user
const registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body);  // Validate input data

  if (error) {
    return res.status(400).json({ message: error.details[0].message });  // If validation fails, send error message
  }

  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);  // Validate input data

  if (error) {
    return res.status(400).json({ message: error.details[0].message });  // If validation fails, send error message
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
};

module.exports = { registerUser, loginUser };
