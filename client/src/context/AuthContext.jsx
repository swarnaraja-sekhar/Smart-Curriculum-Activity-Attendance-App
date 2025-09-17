import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios'; // Import the new API client

// --- (Your mock studentData and facultyData stay the same, but with goals/interests) ---



// --- NEW: WEEKLY STUDY PLAN ---
// This defines the topic of the day for each long-term goal.
export const weeklyStudyPlan = {
  "GATE": {
    "Sunday": "Mock Test & Analysis",
    "Monday": "Data Structures",
    "Tuesday": "Algorithms",
    "Wednesday": "Database Systems",
    "Thursday": "Operating Systems",
    "Friday": "Aptitude & Reasoning",
    "Saturday": "Full Revision"
  },
  "Placement": {
    "Sunday": "Project Work",
    "Monday": "React & Frontend",
    "Tuesday": "System Design Concepts",
    "Wednesday": "JavaScript Fundamentals",
    "Thursday": "Backend & APIs (Node.js)",
    "Friday": "Behavioral Questions Prep",
    "Saturday": "Project Work & Portfolio"
  }
};

// --- UPDATED: TASK DATABASE ---
// Tasks now have a 'topic' that links them to the study plan.
export const taskDatabase = [
  // GATE Tasks
  { title: "Solve GATE Previous Year Questions (DS)", goal: "GATE", topic: "Data Structures" },
  { title: "Implement Binary Search Tree Traversal", goal: "GATE", topic: "Data Structures" },
  { title: "Practice Complex Algorithm Problems", goal: "GATE", topic: "Algorithms" },
  { title: "Review SQL Normalization Concepts", goal: "GATE", topic: "Database Systems" },
  { title: "Study CPU Scheduling Algorithms", goal: "GATE", topic: "Operating Systems" },
  { title: "Solve Time & Work Aptitude Problems", goal: "GATE", topic: "Aptitude & Reasoning" },
  { title: "Take a Full-Length GATE Mock Test", goal: "GATE", topic: "Mock Test & Analysis" },
  // Placement Tasks
  { title: "Build a React Component Library", goal: "Placement", topic: "React & Frontend" },
  { title: "Design a URL Shortening Service", goal: "Placement", topic: "System Design Concepts" },
  { title: "Complete a JavaScript Coding Challenge", goal: "Placement", topic: "JavaScript Fundamentals" },
  { title: "Build a REST API with Express.js", goal: "Placement", topic: "Backend & APIs (Node.js)" },
  // Generic Task
  { title: "Read a Tech Article on Medium", goal: null, topic: null },
];

import timetableData from '../data/timetable.json';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ... (The rest of your AuthContext code (useState, useEffect, login, logout) remains exactly the same)
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const login = async (username, password, role) => {
    try {
      // Use the apiClient instead of fetch
      const response = await apiClient.post(`auth/${role}/login`, {
        username,
        password,
      });

      const data = response.data; // With Axios, the data is in response.data

      if (response.status !== 200) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user info and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setUser(data.user);

      // Redirect based on role
      if (role === 'student') {
        navigate('/student-dashboard');
      } else if (role === 'faculty') {
        navigate('/faculty-dashboard');
      }

    } catch (error) {
      // Axios provides more detailed error info
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
      setNotification({
        type: 'error',
        title: 'Login Failed',
        message: errorMessage,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };
  // --- Live Scheduler for Notifications ---
  useEffect(() => {
    if (!user) return; // Don't run if logged out

    const checkSchedule = () => {
      const now = new Date();
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const todayName = dayNames[now.getDay()];
      
      const todaysSchedule = timetableData[todayName] || [];

      for (const item of todaysSchedule) {
        // Parse time like "09:00 AM"
        const timeString = item.time.split(' - ')[0];
        const [time, period] = timeString.split(' ');
        let [hour, minute] = time.split(':').map(Number);

        if (period.toLowerCase() === 'pm' && hour !== 12) {
          hour += 12;
        }
        if (period.toLowerCase() === 'am' && hour === 12) {
          hour = 0;
        }

        const eventTime = new Date();
        eventTime.setHours(hour, minute, 0, 0);
        
        // Get the time difference in minutes
        const timeDiff = (eventTime - now) / 1000 / 60;
        
        // If we're within the 5-minute window before the event
        if (timeDiff > 0 && timeDiff <= 5) {
          const minutesLeft = Math.ceil(timeDiff);
          if (item.type === 'class') {
            setNotification({
              type: 'info',
              title: 'Upcoming Class',
              message: `Your class "${item.title}" starts in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`,
            });
          } else if (item.type === 'free') {
            setNotification({
              type: 'task',
              title: 'Free Period Coming Up',
              message: `Free period starts in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}. Would you like to work on some tasks?`,
              link: '/student-tasks',
              linkText: 'View Tasks'
            });
          }
        }
      }
    };

    // Check every 3 seconds
    const interval = setInterval(checkSchedule, 3000);

    return () => clearInterval(interval);
  }, [user, setNotification]);


  // Expose setUser for direct updates (like password changes)
  const value = { 
    user, 
    setUser, 
    login, 
    logout, 
    notification, 
    setNotification 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};

