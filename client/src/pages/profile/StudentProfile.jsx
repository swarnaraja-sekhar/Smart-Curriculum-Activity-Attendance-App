import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const StudentProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Student Profile</h1>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Name:</span>
            <span className="text-gray-800">{user.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Role:</span>
            <span className="text-gray-800">{user.role}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Status:</span>
            <span className="text-green-500">Active</span>
          </div>
        </div>

        <button
          className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;
