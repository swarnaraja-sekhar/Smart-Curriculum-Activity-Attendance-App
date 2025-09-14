// /src/pages/public/StudentLoginPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import studentData from '../../data/studentData.json';

export default function StudentLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Log localStorage data when component mounts
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      console.log('Current localStorage user data:', userData ? JSON.parse(userData) : null);
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
    }
  }, []);

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    try {
      console.log('Attempting login with:', username); // Debug log
      
      // Check credentials against studentData.json
      const student = studentData.find(
        (s) => s.username === username && s.password === password
      );

      console.log('Found student:', student ? 'Yes' : 'No'); // Debug log
      
      if (student) {
        const userData = {
          id: student.id,
          name: student.name,
          username: student.username,
          role: 'student',
          branch: student.branch,
          university: student.university,
          classId: student.classId
        };
        
        console.log('Login with user data:', userData); // Debug log
        
        // Show localStorage before login
        console.log('localStorage before login:', JSON.parse(localStorage.getItem('user')));
        
        const success = await login(userData);
        
        // Show localStorage after login
        try {
          const savedData = localStorage.getItem('user');
          console.log('localStorage after login:', savedData ? JSON.parse(savedData) : null);
        } catch (error) {
          console.error('Error parsing localStorage after login:', error);
        }
        
        if (success) {
          console.log('Login successful, navigating to dashboard'); // Debug log
          // We'll let the useEffect in App.jsx handle the navigation
        } else {
          console.error('Login returned false'); // Debug log
          setError('Login failed. Please try again.');
        }
      } else {
        console.error('Student not found with provided credentials'); // Debug log
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Student Portal Login
        </h2>
        <form onSubmit={handleStudentLogin} className="space-y-5">
           <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
              Student Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., o210001"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
            Login as Student
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? 
          <Link to="/signup" className="font-medium text-blue-600 hover:underline ml-1">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}