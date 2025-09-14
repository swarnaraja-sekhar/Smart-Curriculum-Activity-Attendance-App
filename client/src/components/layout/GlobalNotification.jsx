import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SparklesIcon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function GlobalNotification() {
  const { notification, setNotification } = useAuth();

  if (!notification) {
    return null;
  }

  const isTaskNotification = notification.type === 'task';

  // Function to run when any link is clicked
  const handleDismiss = () => {
    setNotification(null);
  };

  return (
    <div className="fixed top-6 right-6 z-50 w-full max-w-sm bg-white rounded-lg shadow-2xl p-4 ring-1 ring-black ring-opacity-5 animate-slide-in">
      {/* (This assumes you have a simple @keyframes animation 'slide-in' in your global.css) */}
      
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 p-3 rounded-full ${isTaskNotification ? 'bg-blue-100' : 'bg-gray-100'}`}>
          {isTaskNotification ? (
            <SparklesIcon className="w-6 h-6 text-blue-600" />
          ) : (
            <BellIcon className="w-6 h-6 text-gray-600" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900">{notification.title}</p>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          
          {/* --- THIS IS THE UPDATED LOGIC --- */}
          {/* If it's a task notification, show the topic selection */}
          {isTaskNotification && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Select a topic for your tasks:</p>
              <div className="flex flex-wrap gap-2">
                <Link 
                  to="/student-tasks?topic=algorithms" 
                  onClick={handleDismiss}
                  className="bg-blue-600 text-white font-medium px-3 py-1.5 rounded-md text-sm hover:bg-blue-700"
                >
                  Algorithms
                </Link>
                <Link 
                  to="/student-tasks?topic=database" 
                  onClick={handleDismiss}
                  className="bg-gray-200 text-gray-800 font-medium px-3 py-1.5 rounded-md text-sm hover:bg-gray-300"
                >
                  Database
                </Link>
                <Link 
                  to="/student-tasks?topic=project" 
                  onClick={handleDismiss}
                  className="bg-gray-200 text-gray-800 font-medium px-3 py-1.5 rounded-md text-sm hover:bg-gray-300"
                >
                  Project Work
                </Link>
              </div>
            </div>
          )}
        </div>
        <button onClick={handleDismiss} className="-mt-2 -mr-2">
          <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>
    </div>
  );
}

