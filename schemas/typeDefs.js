const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    username: String!
    email: String!
    password: String!
    created_at: String!
    updated_at: String!
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String!
    updated_at: String!
  }

 type Query {
  login(username: String!, password: String!): String
  getAllEmployees: [Employee]
  searchEmployeeById(eid: ID!): Employee
  searchEmployeeByDesignationOrDepartment(designation: String, department: String): [Employee]
}

type Mutation {
  signup(username: String!, email: String!, password: String!): String
  addEmployee(first_name: String!, last_name: String!, email: String!, gender: String!, designation: String!, salary: Float!, date_of_joining: String!, department: String!): Employee
  updateEmployee(eid: ID!, first_name: String!, last_name: String!, email: String!, gender: String!, designation: String!, salary: Float!, date_of_joining: String!, department: String!): Employee
  deleteEmployee(eid: ID!): String
}

`;

module.exports = typeDefs;

//Authpayload