// /src/pages/public/FacultyLoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate

// --- 1. YOUR FACULTY DATA ---
// A separate mock data array for faculty.
// Note: We are using 'email' as the login field, unlike the student 'username'.
const facultyData = [
  { "id": 101, "email": "sharma@college.edu", "name": "Dr. Sharma", "password": "password123" },
  { "id": 102, "email": "gupta@college.edu", "name": "Prof. Gupta", "password": "password123" },
  { "id": 103, "email": "patel@college.edu", "name": "Dr. Patel", "password": "password456" }
];


export default function FacultyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for login errors
  const navigate = useNavigate(); // 2. Initialize the hook

  // --- 3. Updated validation logic ---
  const handleFacultyLogin = async (e) => {
    e.preventDefault();
    
    // Check the facultyData array for a match
    const foundUser = facultyData.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      // SUCCESS!
      setError('');
      console.log('Login successful for:', foundUser.name);
      alert(`Welcome, ${foundUser.name}!`);

      // 4. This is the redirect!
      // This navigates the user to the faculty dashboard.
      navigate('/faculty-dashboard');

    } else {
      // FAILED!
      console.log('Login failed: Invalid email or password');
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Faculty Portal Login
        </h2>
        <form onSubmit={handleFacultyLogin} className="space-y-5">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Faculty Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="professor@college.edu"
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* --- 5. Show error message if it exists --- */}
          {error && (
            <p className="text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          <button 
            type="submit"
            className="w-full py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition focus:outline-none focus:ring-2 focus:ring-gray-700"
          >
            Login as Faculty
          </button>
        </form>
        <div className="text-center text-sm text-gray-500 mt-6">
          <Link to="/forgot-password" className="font-medium text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}