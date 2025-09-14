
// /src/pages/public/FacultyLoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import facultyData from '../../data/facultyData.json';

export default function FacultyLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFacultyLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    try {
      // Check credentials against facultyData.json
      const faculty = facultyData.find(
        (f) => f.username === username && f.password === password
      );

      if (faculty) {
        const success = await login({
          id: faculty.id,
          name: faculty.name,
          username: faculty.username,
          role: 'faculty',
          department: faculty.department,
          designation: faculty.designation,
          specialization: faculty.specialization,
          subjects: faculty.subjects,
          classIds: faculty.classIds
        });

        if (success) {
          navigate('/faculty-dashboard');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
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
          Faculty Portal Login
        </h2>
        <form onSubmit={handleFacultyLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
              Faculty ID
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your faculty ID (e.g., f210001)"
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
          <button type="submit" className="w-full py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900">
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