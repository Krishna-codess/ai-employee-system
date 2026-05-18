const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  skills: {
    type: [String],
    default: []
  },
  performanceScore: {
    type: Number,
    required: [true, 'Performance score is required'],
    min: [0, 'Score cannot be less than 0'],
    max: [100, 'Score cannot exceed 100']
  },
  experience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);