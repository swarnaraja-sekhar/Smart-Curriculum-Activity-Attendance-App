import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="absolute inset-0 pattern-grid opacity-60"></div>
      <div className="relative container mx-auto px-6 pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 animate-fade-in-up">
              Automate Attendance.
            </span>
            <br />
            <span className="text-gray-900 animate-fade-in-up delay-100">
              Activate Potential.
            </span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Our platform replaces time-consuming manual roll calls with a secure,
            instant QR code system. We turn unproductive free periods into 
            guided learning opportunities with personalized task suggestions.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-x-6">
            <Link 
              to="/student-login"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 animate-fade-in-up delay-300"
            >
              Student Portal
            </Link>
            <Link 
              to="/faculty-login"
              className="rounded-lg bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border border-gray-200 hover:bg-gray-50 animate-fade-in-up delay-400"
            >
              Faculty Portal
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative blur effects */}
      <div className="absolute top-0 left-0 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 opacity-20 rounded-full blur-3xl animate-fade-in" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400 to-blue-400 opacity-20 rounded-full blur-3xl animate-fade-in delay-200" />
    </section>
  );
}