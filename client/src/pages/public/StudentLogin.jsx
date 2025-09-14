// /src/pages/public/StudentLoginPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import the hook

export default function StudentLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // 2. Get the global login function

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    try {
      // 3. Call the global login function
      const success = login(username, password, 'student'); 
      if (!success) {
        setError('Invalid username or password.');
      }
      // If successful, the AuthContext automatically handles the redirect.
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
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