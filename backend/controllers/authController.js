const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const signup = async (req, res) => {
  try {
    console.log('Step 1: Got request body:', req.body);
    const { name, email, password } = req.body;

    console.log('Step 2: Checking existing user...');
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Step 3: Creating user...');
    const user = await User.create({ name, email, password });

    console.log('Step 4: Generating token...');
    const token = generateToken(user._id);

    console.log('Step 5: Sending response...');
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token
    });
  } catch (error) {
    console.log('CAUGHT ERROR:', error.message);
    console.log('FULL ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login };
