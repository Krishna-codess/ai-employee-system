const Employee = require('../models/Employee');

// @desc  Add new employee
// @route POST /api/employees
const addEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Check for duplicate email
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({
      name, email, department, skills, performanceScore, experience
    });

    res.status(201).json(employee);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all employees
// @route GET /api/employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Search employees by department
// @route GET /api/employees/search?department=Development
const searchEmployees = async (req, res) => {
  try {
    const { department, name } = req.query;
    let query = {};

    if (department) query.department = { $regex: department, $options: 'i' };
    if (name) query.name = { $regex: name, $options: 'i' };

    const employees = await Employee.find(query);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update employee
// @route PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete employee
// @route DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addEmployee, getEmployees, searchEmployees, updateEmployee, deleteEmployee };