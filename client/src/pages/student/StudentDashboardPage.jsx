// /src/pages/student/StudentDashboard.jsx

import React from 'react';
import { BookOpenIcon, ClockIcon, SparklesIcon, UserCircleIcon } from '@heroicons/react/24/outline';

// --- MOCK DATA FOR PROTOTYPE ---
// This is the data for a single student. We are hardcoding "Raja".
const studentName = "Raja";
const studentProfile = {
  username: "o210001",
  major: "Computer Science",
  year: 3,
  attendance: "92%",
  tasksCompleted: 5,
};

// This is the student's schedule, including a free period with a suggested task
const scheduleData = [
  { time: "09:00 AM - 10:00 AM", type: "class", title: "Data Structures & Algorithms" },
  { time: "10:00 AM - 11:00 AM", type: "free", task: {
      title: "Python Algorithm Practice",
      description: "Based on your interest in 'AI', complete two 'Medium' problems on data sorting."
  }},
  { time: "11:00 AM - 12:00 PM", type: "class", title: "Database Management Systems" },
  { time: "12:00 PM - 01:00 PM", type: "free", task: {
      title: "Project Brainstorming",
      description: "Develop a high-level schema for your upcoming hackathon project."
  }},
  { time: "01:00 PM - 02:00 PM", type: "break", title: "Lunch Break" },
  { time: "02:00 PM - 03:00 PM", type: "class", title: "Operating Systems Lab" },
];

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        
        {/* --- Welcome Header --- */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {studentName}!
          </h1>
          <p className="text-lg text-gray-600">
            Here's your schedule and suggested tasks for today.
          </p>
        </div>

        {/* --- Main Dashboard Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* --- Center Column: Today's Schedule & Tasks --- */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Today's Timeline</h2>
            
            {scheduleData.map((item, index) => {
              
              // --- THIS IS THE SMART TASK CARD ---
              // If the type is 'free', we render the special task card.
              if (item.type === 'free') {
                return (
                  <div key={index} className="bg-blue-50 border-2 border-blue-200 rounded-lg shadow-sm p-5 flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                      <SparklesIcon className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-800">{item.time}</p>
                      <h3 className="text-xl font-semibold text-gray-900">Suggested Task: {item.task.title}</h3>
                      <p className="text-gray-700 mt-1">{item.task.description}</p>
                      <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                        Start Task
                      </button>
                    </div>
                  </div>
                );
              }

              // --- THIS IS A REGULAR CLASS CARD ---
              if (item.type === 'class') {
                return (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-5 flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-gray-100 rounded-full p-3">
                      <BookOpenIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500">{item.time}</p>
                      <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    </div>
                  </div>
                );
              }

              // --- THIS IS A BREAK CARD ---
              if (item.type === 'break') {
                 return (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-5 flex items-start space-x-4 border-l-4 border-gray-300">
                     <div className="flex-shrink-0 bg-gray-100 rounded-full p-3">
                      <ClockIcon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500">{item.time}</p>
                      <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    </div>
                  </div>
                )
              }
              return null; // Always return null as a fallback in a map
            })}
          </div>

          {/* --- Right Sidebar: Profile & Stats --- */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-4">
                 <UserCircleIcon className="w-16 h-16 text-gray-400"/>
                 <div>
                    <h3 className="text-xl font-bold text-gray-900">{studentName}</h3>
                    <p className="text-sm text-gray-500">{studentProfile.username}</p>
                 </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Major:</strong> {studentProfile.major}</p>
                <p className="text-gray-700"><strong>Year:</strong> {studentProfile.year}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Overall Attendance</span>
                  <span className="font-bold text-green-600 text-lg">{studentProfile.attendance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Suggested Tasks Completed</span>
                  <span className="font-bold text-blue-600 text-lg">{studentProfile.tasksCompleted}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}