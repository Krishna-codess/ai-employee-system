require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  
  // Delete old user
  await User.deleteMany({});
  console.log('Deleted old users');
  
  // Create new user
  const user = await User.create({
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123'
  });
  console.log('Created user, hashed password:', user.password);
  
  // Test match
  const match = await bcrypt.compare('admin123', user.password);
  console.log('Password matches:', match);
  
  process.exit();
});
