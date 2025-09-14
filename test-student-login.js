// test-student-login.js

// Get username and password from studentData.json (first student)
const studentData = require('./client/src/data/studentData.json');
const testStudent = studentData[0];

console.log('Test student credentials:');
console.log('Username:', testStudent.username);
console.log('Password:', testStudent.password);
console.log('Role:', testStudent.role);
console.log('Name:', testStudent.name);