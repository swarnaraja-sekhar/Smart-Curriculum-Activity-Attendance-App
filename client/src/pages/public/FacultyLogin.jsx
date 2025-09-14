
// /src/pages/public/FacultyLoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import facultyData from '../../data/facultyData.json';

export default function FacultyLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-6 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-30 backdrop-blur-sm"></div>
      <div className="absolute top-20 right-40 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 left-40 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-40 right-40 w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-[0_20px_60px_-10px_rgba(139,92,246,0.3)] border border-violet-100 relative overflow-hidden transform transition-all duration-300 hover:shadow-[0_25px_70px_-12px_rgba(139,92,246,0.4)] z-10">
        {/* Card decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500 to-fuchsia-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl shadow-inner mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <div className="absolute -bottom-1 inset-x-0 h-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 mb-2">
            Faculty Portal
          </h2>
          <p className="text-center text-gray-500 mb-8">Enter your credentials to access your account</p>
          
          <form onSubmit={handleFacultyLogin} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 ml-1">
                Faculty ID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-violet-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-12 pr-5 py-3.5 bg-gray-50/60 border border-violet-100 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-400 transition-all duration-300 outline-none shadow-sm"
                  placeholder="e.g., f210001"
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 ml-1">
                  Password
                </label>
                <button 
                  type="button" 
                  className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
                  onClick={() => alert('Password reset functionality will be implemented here.')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-violet-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50/60 border border-violet-100 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-400 transition-all duration-300 outline-none shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-violet-500 hover:text-violet-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm py-3 px-4 rounded-xl border border-red-100 shadow-sm">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
            <button 
              type="submit" 
              className="w-full py-4 mt-2 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Login as Faculty
            </button>
          </form>
          
          <div className="mt-10 text-center relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">or</span>
            </div>
            
            <div className="mt-6">
              <Link to="/" className="inline-flex items-center justify-center text-sm font-medium text-gray-500 hover:text-violet-600 transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 group-hover:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}