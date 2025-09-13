// /src/components/layout/Navbar.jsx

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import the new useAuth hook
import { UserCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const activeLinkStyle = { fontWeight: '600', color: '#2563EB' };

export default function Navbar() {
  const { user, logout } = useAuth(); // 2. Get the user and logout function from the context

  const renderLinks = () => {
    // === SCENARIO 1: STUDENT IS LOGGED IN ===
    if (user && user.role === 'student') {
      return (
        <>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/student-dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink>
            <NavLink to="/student-attendance" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>My Attendance</NavLink>
            <NavLink to="/student-timetable" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Time Table</NavLink>
          </div>
          <div className="text-gray-600 flex items-center space-x-2">
            <UserCircleIcon className="w-8 h-8" />
            <span className="font-medium">{user.name}</span>
            <button onClick={logout} className="ml-4 text-sm hover:text-blue-600" title="Logout">
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
            </button>
          </div>
        </>
      );
    }

    // === SCENARIO 2: FACULTY IS LOGGED IN ===
    if (user && user.role === 'faculty') {
      return (
        <>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/faculty-dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink>
            <NavLink to="/faculty-reports" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Class Reports</NavLink>
            <NavLink to="/faculty-tasks" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Task Manager</NavLink>
          </div>
          <div className="text-gray-600 flex items-center space-x-2">
            <UserCircleIcon className="w-8 h-8" />
            <span className="font-medium">{user.name}</span>
            <button onClick={logout} className="ml-4 text-sm hover:text-blue-600" title="Logout">
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
            </button>
          </div>
        </>
      );
    }

    // === SCENARIO 3: NOBODY IS LOGGED IN (Public View) ===
    return (
      <div className="space-x-6 flex items-center">
        <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
        <Link to="/student-login" className="text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg transition">
          Student Login
        </Link>
        <Link to="/faculty-login" className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg transition font-medium">
          Faculty Login
        </Link>
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl text-blue-600">
          SmartTrack
        </Link>
        {renderLinks()}
      </div>
    </nav>
  );
}