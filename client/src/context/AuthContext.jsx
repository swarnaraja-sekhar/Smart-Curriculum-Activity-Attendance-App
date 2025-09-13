// /src/context/AuthContext.jsx

import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// --- YOUR MOCK DATA LIVES HERE NOW ---
const studentData = [
  { "id": 1, "username": "o210001", "name": "Raja", "password": "o210001raja", "role": "student" },
  { "id": 2, "username": "o210002", "name": "Priya", "password": "o210002priya", "role": "student" },
  // ... (all your other students)
];

const facultyData = [
  { "id": 101, "email": "sharma@college.edu", "name": "Dr. Sharma", "password": "password123", "role": "faculty" },
  { "id": 102, "email": "gupta@college.edu", "name": "Prof. Gupta", "password": "password123", "role": "faculty" },
  // ... (all your other faculty)
];

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider (the component that will wrap your app)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // The Login Function
  const login = (identifier, password, role) => {
    let foundUser = null;

    if (role === 'student') {
      foundUser = studentData.find(
        (u) => u.username === identifier && u.password === password
      );
    } else if (role === 'faculty') {
      foundUser = facultyData.find(
        (u) => u.email === identifier && u.password === password
      );
    }

    if (foundUser) {
      // Success! Set the user in state (don't store the password!)
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        role: foundUser.role
      };
      setUser(userData);
      
      // Redirect them to their correct dashboard
      if (foundUser.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/faculty-dashboard');
      }
      return true;
    } else {
      // Failed login
      return false;
    }
  };

  // The Logout Function
  const logout = () => {
    setUser(null);
    navigate('/'); // On logout, send them to the homepage
  };

  // The value that all components will get
  const value = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Create a simple hook to use the context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};