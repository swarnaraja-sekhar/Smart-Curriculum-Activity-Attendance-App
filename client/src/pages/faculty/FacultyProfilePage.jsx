// /src/pages/faculty/FacultyProfilePage.jsx

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
  DocumentTextIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import facultyDatabase from '../../data/facultyData.json';
import { useNavigate } from 'react-router-dom';

export default function FacultyProfilePage() {
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
  const userProfile = facultyDatabase.find(u => u.id === user?.id) || {
    name: "Dr. John Doe",
    username: "f210000",
    department: "Computer Science & Engineering",
    university: "Smart India University",
    designation: "Associate Professor",
    specialization: "Artificial Intelligence",
    subjects: ["Data Structures", "Machine Learning", "Algorithm Design"],
    classIds: ["CSE-A", "CSE-B"],
    email: "john.doe@smartuniv.edu",
    phone: "+91 9876543210",
    education: "Ph.D in Computer Science",
    experience: "10+ years in teaching and research",
    researchInterests: ["AI", "Data Mining", "Computer Vision"],
    publications: 15
  };
  
  // Mock data for stats
  const facultyStats = {
    totalClasses: 450,
    totalStudents: 120,
    avgAttendance: 85,
    publications: userProfile.publications || 15,
    completionRate: 92,
    activeProjects: 3
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
        
        // 1. Create a copy of the faculty database
        const updatedFacultyDatabase = [...facultyDatabase];
        
        // 2. Find the user to update and update their password
        const userIndex = updatedFacultyDatabase.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          updatedFacultyDatabase[userIndex] = {
            ...updatedFacultyDatabase[userIndex],
            password: newPassword
          };
          
          // 3. In a real app, this would be an API call to update the backend
          console.log('Password updated in database for faculty:', updatedFacultyDatabase[userIndex].username);
          
          // 4. Update the user in the auth context
          const updatedUser = {
            ...user,
            password: newPassword
          };
          setUser(updatedUser);
          
          // Store the updated user in localStorage to persist the change
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Profile</h1>
        <p className="text-gray-600 mb-6">View and manage your faculty profile</p>

        {/* --- Main Profile Card --- */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden transition-all hover:shadow-2xl">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 border-b border-indigo-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 transform skew-x-12"></div>
            <div className="relative flex flex-col md:flex-row items-center">
              {/* Profile Image */}
              <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6 overflow-hidden border-4 border-white/20 shadow-lg relative group">
                <UserCircleIcon className="h-24 w-24 text-indigo-200" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <CameraIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-1">{userProfile.name}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                  <span className="text-sm bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                    {userProfile.designation}
                  </span>
                  <span className="text-sm bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                    {userProfile.department}
                  </span>
                </div>
                <p className="text-indigo-100">{userProfile.specialization}</p>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <UserCircleIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Faculty ID</p>
                    <p className="font-mono">{userProfile.username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{userProfile.email || `${userProfile.username}@smartuniv.edu`}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{userProfile.phone || "+91 9876543210"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">University</p>
                    <p>{userProfile.university}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Education</p>
                    <p>{userProfile.education || "Ph.D in Computer Science"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Experience</p>
                    <p>{userProfile.experience || "10+ years in teaching and research"}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    Security
                  </h3>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center space-x-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    <KeyIcon className="h-4 w-4" />
                    <span>Change Password</span>
                  </button>
                </div>
              </div>
              
              {/* Right Column - Academic Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Academic Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Classes</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {userProfile.classIds?.map((classId, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {classId}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Subjects</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {userProfile.subjects?.map((subject, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Research Interests</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(userProfile.researchInterests || ["AI", "Machine Learning", "Data Mining"]).map((interest, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    Statistics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-indigo-800">{facultyStats.totalClasses}</p>
                      <p className="text-xs text-gray-500">Classes Taught</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">{facultyStats.totalStudents}</p>
                      <p className="text-xs text-gray-500">Students</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-green-800">{facultyStats.avgAttendance}%</p>
                      <p className="text-xs text-gray-500">Avg. Attendance</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-purple-800">{facultyStats.publications}</p>
                      <p className="text-xs text-gray-500">Publications</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">{facultyStats.completionRate}%</p>
                      <p className="text-xs text-gray-500">Completion Rate</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-red-800">{facultyStats.activeProjects}</p>
                      <p className="text-xs text-gray-500">Active Projects</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activities Section */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-600" />
                Recent Activities
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <AcademicCapIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium">Class Attendance Updated</p>
                      <p className="text-sm text-gray-500">You updated attendance for CSE-A Data Structures class</p>
                      <p className="text-xs text-gray-400 mt-1">Today, 10:30 AM</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <DocumentTextIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Assignment Created</p>
                      <p className="text-sm text-gray-500">You created a new assignment "Machine Learning Project" for CSE-B</p>
                      <p className="text-xs text-gray-400 mt-1">Yesterday, 3:45 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <ChartBarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Report Generated</p>
                      <p className="text-sm text-gray-500">You generated a monthly attendance report for CSE-A and CSE-B</p>
                      <p className="text-xs text-gray-400 mt-1">Sep 12, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowPasswordModal(false)}></div>
            
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-10 relative">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <KeyIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Change Password
                </h3>
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handlePasswordChange} className="p-6">
                {passwordSuccess ? (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg text-green-800 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Password updated successfully!</p>
                      {jsonUpdated && (
                        <p className="text-xs mt-1">In a real app, this would update your password in the database.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {passwordError && (
                      <div className="mb-6 p-4 bg-red-50 rounded-lg text-red-800">
                        {passwordError}
                      </div>
                    )}
                    
                    {/* Current Password */}
                    <div className="mb-4">
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                    <div className="mb-4">
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    
                    {/* Confirm Password */}
                    <div className="mb-6">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowPasswordModal(false)}
                        className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                      >
                        Update Password
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}