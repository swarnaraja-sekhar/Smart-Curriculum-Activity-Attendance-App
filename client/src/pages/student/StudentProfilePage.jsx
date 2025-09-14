// /src/pages/student/StudentProfile.jsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  UserCircleIcon, 
  PencilIcon, 
  KeyIcon, 
  ShieldCheckIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  CameraIcon,
  AcademicCapIcon,
  BookOpenIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import studentDatabase from '../../data/studentData.json';
import { useNavigate } from 'react-router-dom';

export default function StudentProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [jsonUpdated, setJsonUpdated] = useState(false);
  
  // Find the user's full profile
  const userProfile = studentDatabase.find(u => u.id === user?.id) || {
    name: "Student Name",
    username: "student_username",
    branch: "Computer Science",
    university: "Sample University",
    year: "3rd Year",
    enrollmentYear: "2023",
    interests: ["Web Development", "AI", "Mobile Apps"],
    longTermGoal: "Software Engineer"
  };
  
  // Password validation
  const validatePassword = () => {
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return false;
    }
    
    // Validate current password against stored password
    if (currentPassword !== userProfile.password) {
      setPasswordError('Current password is incorrect');
      return false;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return false;
    }
    
    setPasswordError('');
    return true;
  };
  
  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (validatePassword()) {
      // Update the password in our local state first
      setPasswordSuccess(true);
      setJsonUpdated(true);
      
      // In a real app with a backend API, we would do:
      // 1. Make an API call to update the password in the database
      // 2. Upon success, update the local state
      
      try {
        // This is a demonstration of how we would update the JSON file
        // In a real app, this would be handled by a backend API
        
        // 1. Create a copy of the student database
        const updatedStudentDatabase = [...studentDatabase];
        
        // 2. Find the user to update and update their password
        const userIndex = updatedStudentDatabase.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          updatedStudentDatabase[userIndex] = {
            ...updatedStudentDatabase[userIndex],
            password: newPassword
          };
          
          // 3. In a real app, this would be an API call to update the backend
          console.log('Password updated in database for user:', updatedStudentDatabase[userIndex].username);
          
          // 4. Update the user in the auth context
          const updatedUser = {
            ...user,
            password: newPassword
          };
          setUser(updatedUser);
          
          // Store the updated user in localStorage to persist the change
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          // This would normally be where we write back to the JSON file
          // But since we're in a browser environment, we can't directly write to the filesystem
          // Instead, we show a message indicating the JSON would be updated in a real app
        }
      } catch (error) {
        console.error('Error updating password:', error);
        setPasswordError('An error occurred while updating your password');
        setPasswordSuccess(false);
        return;
      }
      
      // Reset form after successful submission
      setTimeout(() => {
        setPasswordSuccess(false);
        setJsonUpdated(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordModal(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600 mb-6">View and manage your student profile</p>

        {/* --- Main Profile Card --- */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden transition-all hover:shadow-2xl">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 border-b border-blue-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mb-32 -mr-32 blur-2xl"></div>
            
            <div className="flex flex-col items-center sm:flex-row sm:items-center relative z-10">
              <div className="relative group">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-8 overflow-hidden border-4 border-white/30">
                  <UserCircleIcon className="w-24 h-24 text-white" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full cursor-pointer">
                  <CameraIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold text-white">{userProfile.name}</h2>
                <p className="text-lg text-blue-100 font-medium">{userProfile.username}</p>
                <div className="flex flex-wrap justify-center sm:justify-start mt-2 gap-2">
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    {userProfile.branch}
                  </span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    {userProfile.year || '3rd Year'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Account Details Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ShieldCheckIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Account Details
                </h3>
                <dl className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="text-sm font-semibold text-gray-900 sm:col-span-2">{userProfile.name}</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <dt className="text-sm font-medium text-gray-500">Username</dt>
                    <dd className="text-sm font-semibold text-gray-900 sm:col-span-2">{userProfile.username}</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <dt className="text-sm font-medium text-gray-500">Branch</dt>
                    <dd className="text-sm font-semibold text-gray-900 sm:col-span-2">{userProfile.branch}</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <dt className="text-sm font-medium text-gray-500">University</dt>
                    <dd className="text-sm font-semibold text-gray-900 sm:col-span-2">{userProfile.university}</dd>
                  </div>

                  {/* Password Field */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow transition-all">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <KeyIcon className="w-4 h-4 mr-1 text-gray-400" />
                      Password
                    </dt>
                    <dd className="text-sm text-gray-900 sm:col-span-2 flex justify-between items-center">
                      <span>••••••••••••</span>
                      <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <PencilIcon className="w-4 h-4 mr-1.5" />
                        Change
                      </button>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Academic Profile Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <AcademicCapIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Academic Profile
                </h3>
                <dl className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <dt className="text-sm font-medium text-gray-500">Year</dt>
                    <dd className="text-sm font-semibold text-gray-900 sm:col-span-2">{userProfile.year || '3rd Year'}</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <dt className="text-sm font-medium text-gray-500">Enrolled</dt>
                    <dd className="text-sm font-semibold text-gray-900 sm:col-span-2">{userProfile.enrollmentYear || '2023'}</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <dt className="text-sm font-medium text-gray-500">Goal</dt>
                    <dd className="text-sm font-semibold text-gray-900 sm:col-span-2">
                      {userProfile.longTermGoal || 'Software Engineer'}
                    </dd>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Interests</dt>
                    <dd className="sm:col-span-2">
                      <div className="flex flex-wrap gap-2">
                        {(userProfile.interests || ['Web Development', 'AI', 'Mobile Apps']).map((interest, index) => (
                          <span 
                            key={index}
                            className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full border border-blue-100"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                  
                  <div className="mt-2 text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center ml-auto">
                      <BookOpenIcon className="w-4 h-4 mr-1" />
                      View Academic Record
                    </button>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        {/* Update Button */}
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm font-medium">
            Update Profile
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
            {/* Close button */}
            <button 
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordError('');
                setPasswordSuccess(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 mb-1">Change Password</h3>
            <p className="text-gray-600 text-sm mb-6">Ensure your account is protected with a strong password</p>
            
            {passwordSuccess ? (
              <div className="text-center py-8">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Password Updated!</h3>
                <p className="text-gray-600">Your password has been changed successfully.</p>
                {jsonUpdated && (
                  <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded-lg flex items-start">
                    <DocumentTextIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">studentData.json updated:</span> In a real application, 
                      this change would be saved to the database and the JSON file would be updated.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handlePasswordChange}>
                {passwordError && (
                  <div className="bg-red-50 text-red-800 p-3 rounded-lg mb-4 text-sm">
                    {passwordError}
                  </div>
                )}
                
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-2 top-2 text-gray-500"
                      >
                        {showCurrentPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* New Password */}
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2 top-2 text-gray-500"
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters
                    </p>
                  </div>
                  
                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-2 text-gray-500"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add custom animation */}
      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}