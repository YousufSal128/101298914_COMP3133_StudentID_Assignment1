const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const resolvers = {
  Query: {
    // Get all employees (protected route)
    getAllEmployees: async (_, __, { user }) => {
      if (!user) {
        throw new Error('You are not authorized to access this data');
      }
      return await Employee.find();
    },

    // Search for an employee by ID (protected route)
    searchEmployeeById: async (_, { eid }, { user }) => {
      if (!user) {
        throw new Error('You are not authorized to access this data');
      }
      const employee = await Employee.findById(eid);
      if (!employee) throw new Error('Employee not found');
      return employee;
    },

    // Search for employees by designation or department (protected route)
    searchEmployeeByDesignationOrDepartment: async (_, { designation, department }, { user }) => {
      if (!user) {
        throw new Error('You are not authorized to access this data');
      }
      return await Employee.find({
        $or: [{ designation }, { department }],
      });
    },

    // Login query (public route)
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return token; // Return the token
    },
  },

  Mutation: {
    // User signup mutation (public route)
    signup: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) throw new Error('Username or email already exists');
    
      const newUser = new User({ username, email, password });
      await newUser.save();
    
      return 'User created successfully';
    },

    // Add a new employee (protected route)
    addEmployee: async (_, { first_name, last_name, email, gender, designation, salary, date_of_joining, department }, { user }) => {
      if (!user) {
        throw new Error('You are not authorized to access this data');
      }

      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) throw new Error('Employee with this email already exists');

      const newEmployee = new Employee({
        first_name,
        last_name,
        email,
        gender,
        designation,
        salary,
        date_of_joining,
        department,
      });

      await newEmployee.save();
      return newEmployee;
    },

    // Update an existing employee (protected route)
    updateEmployee: async (_, { eid, first_name, last_name, email, gender, designation, salary, date_of_joining, department }, { user }) => {
      if (!user) {
        throw new Error('You are not authorized to access this data');
      }

      const updatedEmployee = await Employee.findByIdAndUpdate(
        eid,
        { first_name, last_name, email, gender, designation, salary, date_of_joining, department },
        { new: true }
      );
      if (!updatedEmployee) throw new Error('Employee not found');
      return updatedEmployee;
    },

    // Delete an employee by ID (protected route)
    deleteEmployee: async (_, { eid }, { user }) => {
      if (!user) {
        throw new Error('You are not authorized to access this data');
      }

      const deletedEmployee = await Employee.findByIdAndDelete(eid);
      if (!deletedEmployee) throw new Error('Employee not found');
      return 'Employee deleted successfully';
    },
  },
};

module.exports = resolvers;
