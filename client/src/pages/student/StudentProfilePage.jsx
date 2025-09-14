// /src/pages/student/StudentProfile.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext'; // To know WHO is logged in
import { UserCircleIcon, PencilIcon } from '@heroicons/react/24/outline';
import studentDatabase from '../../data/studentData.json';


export default function StudentProfile() {
  // 1. Get the currently logged-in user's basic info from context.
  const { user } = useAuth();

  // 2. Find the user's FULL profile from the mock database using their ID.
  // In a real app, this would be an API call: GET /api/profile/{user.id}
  const userProfile = studentDatabase.find(u => u.id === user.id);

  // Fallback in case the user isn't found (shouldn't happen in our prototype)
  if (!userProfile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

        {/* --- Main Profile Card --- */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          
          {/* Profile Header */}
          <div className="bg-gray-50 p-8 border-b border-gray-200 flex flex-col items-center sm:flex-row">
            <UserCircleIcon className="w-32 h-32 text-gray-400 mb-4 sm:mb-0 sm:mr-8" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{userProfile.name}</h2>
              <p className="text-lg text-blue-600 font-medium">{userProfile.username}</p>
              <p className="text-md text-gray-600 mt-1">{userProfile.branch}</p>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h3>
            <dl className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="text-sm text-gray-900 col-span-2">{userProfile.name}</dd>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Student Username</dt>
                <dd className="text-sm text-gray-900 col-span-2">{userProfile.username}</dd>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Branch</dt>
                <dd className="text-sm text-gray-900 col-span-2">{userProfile.branch}</dd>
              </div>
               <div className="grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">University</dt>
                <dd className="text-sm text-gray-900 col-span-2">{userProfile.university}</dd>
              </div>

              {/* Password Field */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <dt className="text-sm font-medium text-gray-500">Password</dt>
                <dd className="text-sm text-gray-900 col-span-2 flex justify-between items-center">
                  <span>••••••••••••</span>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Change Password
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>

      </div>
    </div>
  );
}