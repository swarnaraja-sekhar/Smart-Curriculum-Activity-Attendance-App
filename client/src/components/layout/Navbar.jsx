// /src/components/layout/Navbar.jsx

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCircleIcon, ArrowLeftOnRectangleIcon, QrCodeIcon } from '@heroicons/react/24/outline';

const activeLinkStyle = { fontWeight: '600', color: '#2563EB' };

export default function Navbar() {
  const { user, logout } = useAuth(); // Get user state and logout function

  const renderLinks = () => {
    // === STUDENT IS LOGGED IN ===
    if (user && user.role === 'student') {
      return (
        <>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/student-dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink>
            <NavLink to="/student-attendance" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>My Attendance</NavLink>
            <NavLink to="/student-timetable" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Time Table</NavLink>
          </div>
          <div className="flex items-center space-x-4">
            {/* QR Code Scanner Button */}
            <Link
              to="/scan-attendance"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition bg-blue-50 px-3 py-2 rounded-lg"
              title="Scan QR for Attendance"
            >
              <QrCodeIcon className="w-6 h-6" />
              <span className="text-sm font-medium">Scan QR</span>
            </Link>

            {/* Profile Link */}
            <Link 
              to="/student-profile" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition"
              title="View Profile"
            >
              <UserCircleIcon className="w-8 h-8" />
              <span className="font-medium">{user.name}</span>
            </Link>

            {/* Logout Button */}
            <button onClick={logout} className="text-gray-500 hover:text-blue-600" title="Logout">
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
            </button>
          </div>
        </>
      );
    }

    // === FACULTY IS LOGGED IN ===
    if (user && user.role === 'faculty') {
      return (
        <>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/faculty-dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink>
            <NavLink to="/faculty-reports" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Class Reports</NavLink>
            <NavLink to="/faculty-tasks" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Task Manager</NavLink>
            <NavLink to="/faculty-attendance" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Attendance</NavLink>
            <NavLink to="/faculty-students" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Students</NavLink>
          </div>
          <div className="flex items-center space-x-4">
            {/* QR Code Generator Button */}
            <Link
              to="/generate-qr"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition bg-blue-50 px-3 py-2 rounded-lg"
              title="Generate QR Code"
            >
              <QrCodeIcon className="w-6 h-6" />
              <span className="text-sm font-medium">Generate QR</span>
            </Link>

            {/* Profile Link */}
            <Link 
              to="/faculty-profile"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition"
              title="View Profile"
            >
              <UserCircleIcon className="w-8 h-8" />
              <span className="font-medium">{user.name}</span>
            </Link>

            {/* Logout Button */}
            <button 
              onClick={logout} 
              className="text-gray-500 hover:text-blue-600 flex items-center space-x-2" 
              title="Logout"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </>
      );
    }

    // === NOBODY IS LOGGED IN ===
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