import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  QrCodeIcon, 
  UserGroupIcon, 
  ClockIcon, 
  ChartBarIcon,
  AcademicCapIcon,
  LightBulbIcon 
} from '@heroicons/react/24/outline';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(current => (current + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: QrCodeIcon,
      title: "Dynamic QR Attendance",
      description: "Secure, tamper-proof QR code system for instant attendance verification"
    },
    {
      icon: UserGroupIcon,
      title: "Curriculum Management",
      description: "Comprehensive tracking of academic activities and curriculum progress"
    },
    {
      icon: ClockIcon,
      title: "Time Table Integration",
      description: "Smart scheduling with automated notifications and reminders"
    },
    {
      icon: ChartBarIcon,
      title: "Performance Analytics",
      description: "Detailed reports on attendance patterns and academic activities"
    },
    {
      icon: AcademicCapIcon,
      title: "Faculty Dashboard",
      description: "Streamlined interface for managing classes and monitoring student engagement"
    },
    {
      icon: LightBulbIcon,
      title: "Student Portal",
      description: "Easy access to attendance records, schedules, and academic tasks"
    }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Animated background pattern */}
      <div className="absolute inset-0 pattern-grid opacity-60 animate-pulse"></div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-24 h-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + i * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className={`text-center max-w-6xl mx-auto transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative inline-block mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
              <span className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient animate-fade-in-out">
                Smart Curriculum
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></div>
              </span>
              <br />
              <span className="relative inline-block text-gray-900 mt-4 animate-fade-in-out animate-delay-1">
                Activity Tracker
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gray-900 transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></div>
              </span>
            </h1>
          </div>
          
          <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-out animate-delay-2">
            Revolutionizing curriculum management and attendance tracking with QR-based technology
            <span className="block mt-4 font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-fade-in-out animate-delay-3">
              Efficient • Secure • Real-time
            </span>
          </p>
          
          <div className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-out animate-delay-3">
            <p className="mb-4">
              Our comprehensive system streamlines academic activity tracking while providing valuable insights 
              into student engagement and curriculum effectiveness.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl transform transition-all duration-500 ${
                  activeFeature === index 
                    ? 'bg-white shadow-xl scale-105' 
                    : 'bg-white/50 hover:bg-white hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Key Benefits Section */}
          <div className="mt-20 pb-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Why Choose Our Platform?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Attendance Accuracy</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
                <div className="text-gray-600">Time Saved</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">System Availability</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-bold text-blue-600 mb-2">Real-time</div>
                <div className="text-gray-600">Activity Tracking</div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-x-6">
            <Link 
              to="/student-login"
              className="group relative rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span className="relative z-10">Student Portal</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              to="/faculty-login"
              className="group relative rounded-lg bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 overflow-hidden"
            >
              <span className="relative z-10">Faculty Portal</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '1000+', label: 'Active Students' },
              { number: '95%', label: 'Attendance Rate' },
              { number: '100+', label: 'Faculty Members' }
            ].map((stat, index) => (
              <div key={index} className="p-6 bg-white bg-opacity-70 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl font-bold text-indigo-600">{stat.number}</div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced decorative blur effects */}
      <div className="absolute top-0 left-0 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 opacity-20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400 to-blue-400 opacity-20 rounded-full blur-3xl animate-pulse delay-200" />
    </section>
  );
}