// /src/components/layout/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon, 
  QrCodeIcon, 
  Bars3Icon, 
  XMarkIcon, 
  HomeIcon, 
  CalendarIcon, 
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  AcademicCapIcon,
  BellIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const renderLinks = () => {
    // === STUDENT IS LOGGED IN ===
    if (user && user.role === 'student') {
      return (
        <>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink 
              to="/student-dashboard" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`
              }
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink 
              to="/student-attendance" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`
              }
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span>My Attendance</span>
            </NavLink>
            
            <NavLink 
              to="/student-timetable" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`
              }
            >
              <ClockIcon className="w-5 h-5 mr-2" />
              <span>Time Table</span>
            </NavLink>
          </div>
          
          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* QR Code Scanner Button */}
            <Link
              to="/scan-attendance"
              className="flex items-center space-x-2 text-gray-700 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 px-4 py-2.5 rounded-lg transition-all duration-200 border border-blue-100"
              title="Scan QR for Attendance"
            >
              <QrCodeIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Scan QR</span>
            </Link>

            {/* Profile Link */}
            <div className="relative group">
              <Link 
                to="/student-profile" 
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
                title="View Profile"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.branch || 'Student'}</span>
                </div>
              </Link>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200" 
              title="Logout"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Right Side */}
          <div className="lg:hidden flex items-center space-x-1">
            {/* QR Code Scanner Button - Mobile */}
            <Link
              to="/scan-attendance"
              className="flex items-center justify-center w-10 h-10 text-blue-600 bg-blue-50 rounded-lg"
              title="Scan QR for Attendance"
            >
              <QrCodeIcon className="w-5 h-5" />
            </Link>
            
            {/* Mobile menu toggle */}
            <button
              onClick={toggleMobileMenu}
              className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-gray-800 bg-opacity-50 backdrop-blur-sm">
              <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-all duration-300 flex flex-col">
                {/* Close button */}
                <div className="flex justify-between items-center p-4 border-b">
                  <Link to={getDashboardUrl()} onClick={closeMobileMenu} className="font-semibold text-blue-600">SmartTrack</Link>
                  <button 
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Profile section */}
                <div className="flex items-center space-x-3 p-4 border-b">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.branch || 'Student'}</span>
                  </div>
                </div>
                
                {/* Nav links */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                  <NavLink 
                    to="/student-dashboard" 
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    <HomeIcon className="w-5 h-5 mr-3" />
                    <span>Dashboard</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/student-attendance" 
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    <CalendarIcon className="w-5 h-5 mr-3" />
                    <span>My Attendance</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/student-timetable" 
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    <ClockIcon className="w-5 h-5 mr-3" />
                    <span>Time Table</span>
                  </NavLink>
                </div>
                
                {/* Bottom actions */}
                <div className="border-t p-4">
                  <button 
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="flex items-center space-x-3 text-red-600 p-3 w-full rounded-lg hover:bg-red-50"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    // === FACULTY IS LOGGED IN ===
    if (user && user.role === 'faculty') {
      return (
        <>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink 
              to="/faculty-dashboard" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`
              }
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink 
              to="/faculty-reports" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`
              }
            >
              <ChartBarIcon className="w-5 h-5 mr-2" />
              <span>Class Reports</span>
            </NavLink>
            
            <NavLink 
              to="/faculty-attendance" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`
              }
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span>Attendance</span>
            </NavLink>
            
            <NavLink 
              to="/faculty-students" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`
              }
            >
              <UsersIcon className="w-5 h-5 mr-2" />
              <span>Students</span>
            </NavLink>
          </div>
          
          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                2
              </span>
            </button>

            {/* Profile Link */}
            <div className="relative group">
              <Link 
                to="/faculty-profile" 
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
                title="View Profile"
                onClick={() => navigate('/faculty-profile')}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'F'}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.department || 'Faculty'}</span>
                </div>
              </Link>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200" 
              title="Logout"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Mobile Right Side */}
          <div className="lg:hidden flex items-center space-x-1">
            {/* Notifications - Mobile */}
            <button className="relative flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-2 right-2 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                2
              </span>
            </button>
            
            {/* Mobile menu toggle */}
            <button
              onClick={toggleMobileMenu}
              className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-gray-800 bg-opacity-50 backdrop-blur-sm">
              <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl transform transition-all duration-300 flex flex-col">
                {/* Close button */}
                <div className="flex justify-between items-center p-4 border-b">
                  <Link to={getDashboardUrl()} onClick={closeMobileMenu} className="font-semibold text-blue-600">SmartTrack</Link>
                  <button 
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Profile section */}
                <div className="flex items-center space-x-3 p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold shadow-md">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'F'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-lg">{user.name}</span>
                    <span className="text-sm text-gray-600">{user.department || 'Faculty'}</span>
                    <div className="mt-1 flex items-center text-xs text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full w-fit">
                      <AcademicCapIcon className="w-3 h-3 mr-1" />
                      Faculty
                    </div>
                  </div>
                </div>
                
                {/* Nav links */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                  <NavLink 
                    to="/faculty-dashboard" 
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    <HomeIcon className="w-5 h-5 mr-3" />
                    <span>Dashboard</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/faculty-reports" 
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    <ChartBarIcon className="w-5 h-5 mr-3" />
                    <span>Class Reports</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/faculty-attendance" 
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    <CalendarIcon className="w-5 h-5 mr-3" />
                    <span>Attendance</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/faculty-students" 
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    <UsersIcon className="w-5 h-5 mr-3" />
                    <span>Students</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/generate-qr" 
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    <QrCodeIcon className="w-5 h-5 mr-3" />
                    <span>Generate QR</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/faculty-profile" 
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => {
                      closeMobileMenu();
                      navigate('/faculty-profile');
                    }}
                  >
                    <UserCircleIcon className="w-5 h-5 mr-3" />
                    <span>My Profile</span>
                  </NavLink>
                </div>
                
                {/* Bottom actions */}
                <div className="border-t p-4">
                  <button 
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="flex items-center space-x-3 text-red-600 p-3 w-full rounded-lg hover:bg-red-50"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    // === NOBODY IS LOGGED IN ===
    return (
      <div className="space-x-2 flex items-center">
        <Link to="/" className="text-gray-700 hover:text-blue-600 transition px-4 py-2 hover:bg-gray-50 rounded-lg">Home</Link>
        <Link to="/student-login" className="text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-gray-100 py-2 px-4 rounded-lg transition-all duration-200">
          Student Login
        </Link>
        <Link to="/faculty-login" className="text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow font-medium">
          Faculty Login
        </Link>
      </div>
    );
  };

  // Function to determine the dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'student':
        return '/student-dashboard';
      case 'faculty':
        return '/faculty-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className={`bg-white sticky top-0 z-40 w-full transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <Link to={getDashboardUrl()} className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg h-8 w-8 flex items-center justify-center text-xl">S</div>
            <span className="font-bold text-xl text-gray-800">SmartTrack</span>
          </Link>
        </div>

        {/* Right side - Navigation links */}
        {renderLinks()}
      </div>
    </nav>
  );
}