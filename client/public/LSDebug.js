// LSDebug.js - Local Storage Debugger

/**
 * This file provides a simple utility to debug localStorage in the browser.
 * 
 * To use:
 * 1. Open your browser console
 * 2. Type or paste these commands:
 */

// View the current user data in localStorage
function viewUserData() {
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('Current user data in localStorage:', userData);
    
    if (userData) {
      console.log('User is logged in as:', userData.name);
      console.log('User role:', userData.role);
      console.log('Username:', userData.username);
    } else {
      console.log('No user data found in localStorage (not logged in)');
    }
    
    return userData;
  } catch (error) {
    console.error('Error parsing localStorage user data:', error);
    return null;
  }
}

// Clear user data from localStorage (force logout)
function clearUserData() {
  localStorage.removeItem('user');
  console.log('User data cleared from localStorage');
}

// Set test user data for debugging
function setTestStudentData() {
  const testStudent = {
    id: 1,
    name: "Raja",
    username: "o210001",
    role: "student",
    branch: "Computer Science & Engineering",
    university: "Smart India University",
    classId: "CSE-A"
  };
  
  localStorage.setItem('user', JSON.stringify(testStudent));
  console.log('Test student data set in localStorage');
}

// Instruction message
console.log(`
Local Storage Debug Utilities:
-----------------------------
- To view current user data: viewUserData()
- To clear user data (force logout): clearUserData()
- To set test student data: setTestStudentData()

Example: Open console and type "viewUserData()" to see current user data
`);

// Make functions available globally
window.viewUserData = viewUserData;
window.clearUserData = clearUserData;
window.setTestStudentData = setTestStudentData;