import React from "react";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 bg-white shadow-md">
        <div className="flex items-center space-x-3">
          {/* <img src={logo} alt="Smart Education" className="h-10 w-10" /> */}
          <span className="font-bold text-xl text-gray-800">Smart Education</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20 bg-gradient-to-r from-blue-100 to-blue-200">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Beyond Learning: <span className="text-blue-600">Smart Education</span>
          </h1>
          <p className="text-gray-700 text-lg">
            Automate attendance, suggest personalized tasks, and organize your day with ease.
            Empower students, teachers, and parents with a smarter classroom experience.
          </p>
          <div className="space-x-4">
            <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Get Started
            </Link>
            <Link to="/login" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
              Login
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          {/* <img src={logo} alt="Education Illustration" className="w-full rounded-lg shadow-lg" /> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 bg-white grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Automated Attendance</h2>
          <p className="text-gray-600">QR code, Bluetooth, or face recognition for instant attendance.</p>
        </div>
        <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Personalized Tasks</h2>
          <p className="text-gray-600">Challenges and tasks tailored to students’ strengths and goals.</p>
        </div>
        <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Timetable & Planning</h2>
          <p className="text-gray-600">View your classes, free periods, and long-term goals in one routine.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
