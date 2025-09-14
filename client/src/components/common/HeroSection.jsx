// /src/pages/public/HomePage.jsx

import { ChartBarIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* --- Main Hero Section --- */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-6 py-24 lg:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Automate Attendance. Activate Potential.
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform replaces time-consuming manual roll calls with a secure,
            instant QR code system. We turn unproductive free periods into 
            guided learning opportunities with personalized task suggestions.
          </p>
          
          <div className="mt-10 flex justify-center gap-x-6">
            <Link 
              to="/student-login"
              className="rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Student Portal
            </Link>
            <Link 
              to="/faculty-login"
              className="rounded-lg bg-gray-100 px-5 py-3 text-base font-semibold text-gray-800 shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Faculty Portal
            </Link>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              A Smarter Campus for Everyone
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Key features designed for students, faculty, and administrators.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Feature 1: Attendance */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <ClockIcon className="w-9 h-9 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Secure Automated Attendance
              </h3>
              <p className="text-gray-600">
                Reclaim class time with our one-time-use QR code system. Stop proxies and 
                get accurate, instant attendance records without the paperwork.
              </p>
            </div>

            {/* Feature 2: Smart Tasks */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <SparklesIcon className="w-9 h-9 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Smart Task Suggestions
              </h3>
              <p className="text-gray-600">
                Our system suggests personalized tasks and projects to students during 
                their free periods, aligning their activities with their career goals.
              </p>
            </div>

            {/* Feature 3: Analytics */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <ChartBarIcon className="w-9 h-9 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Real-Time Data Insights
              </h3>
              <p className="text-gray-600">
                Faculty and Admins get powerful dashboards to track student engagement,
                view attendance trends, and make better data-driven decisions.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}