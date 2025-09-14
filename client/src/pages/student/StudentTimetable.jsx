import React from 'react';
import { useAuth } from '../../context/AuthContext';
import timetableData from '../../data/timetable.json';
import { BookOpenIcon, SparklesIcon, FlagIcon } from '@heroicons/react/24/outline';
import DailyRoutine from '../../components/student/DailyRoutine';

// --- TASK DATABASE ---
const taskDatabase = [
  // GATE Preparation Tasks
  { title: "Solve GATE Previous Year Questions (DS)", goal: "GATE", interest: "Algorithms", priority: "high", duration: 60 },
  { title: "Practice Aptitude & Reasoning", goal: "GATE", interest: "Competitive Programming", priority: "medium", duration: 45 },
  { title: "Review Operating Systems Concepts", goal: "GATE", interest: "OS", priority: "high", duration: 60 },
  { title: "Solve Computer Networks Problems", goal: "GATE", interest: "Networking", priority: "medium", duration: 45 },
  { title: "Practice DBMS Queries", goal: "GATE", interest: "Databases", priority: "high", duration: 30 },
  
  // Placement Preparation Tasks
  { title: "Build a React Component Library", goal: "Placement", interest: "Web Development", priority: "high", duration: 60 },
  { title: "Design a Landing Page in Figma", goal: "Placement", interest: "UI/UX Design", priority: "medium", duration: 45 },
  { title: "Practice Coding Interview Questions", goal: "Placement", interest: "Programming", priority: "high", duration: 60 },
  { title: "Mock Interview Practice", goal: "Placement", interest: "Soft Skills", priority: "high", duration: 30 },
  { title: "Update Portfolio Website", goal: "Placement", interest: "Web Development", priority: "medium", duration: 90 },
  
  // Self-Development Tasks
  { title: "Read about latest JS Frameworks", goal: "Learning", interest: "Web Development", priority: "low", duration: 30 },
  { title: "Practice Data Structures", goal: "Learning", interest: "Programming", priority: "medium", duration: 45 },
  { title: "Work on Personal Project", goal: "Learning", interest: "Development", priority: "medium", duration: 60 },
  { title: "Watch Technical Tutorials", goal: "Learning", interest: "Technology", priority: "low", duration: 30 },
  
  // General Tasks
  { title: "Review Class Notes", goal: null, interest: null, priority: "medium", duration: 30 },
  { title: "Complete Assignments", goal: null, interest: null, priority: "high", duration: 60 },
  { title: "Prepare for Tomorrow's Classes", goal: null, interest: null, priority: "medium", duration: 45 }
];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todayName = dayNames[new Date().getDay()];

// --- THE RECOMMENDATION ENGINE LOGIC ---
const generateRoutineForStudent = (student) => {
  if (!student) return [];

  const schedule = student.schedule || [];
  const currentHour = new Date().getHours();
  
  // Track suggested tasks to avoid duplicates
  const suggestedTaskIds = new Set();
  
  return schedule.map((period, index) => {
    if (period.type === 'free') {
      let suggestedTask = null;
      const [startHour] = period.time.split(':').map(Number);
      const timeOfDay = startHour < 12 ? 'morning' : startHour < 17 ? 'afternoon' : 'evening';
      
      // Calculate available time from period duration
      const [start, end] = period.time.split(' - ').map(time => {
        const [hours, minutes] = time.replace(/[AP]M/, '').split(':').map(Number);
        return hours + (minutes / 60);
      });
      const availableTime = Math.round((end - start) * 60); // Convert to minutes

      // Filter tasks by available time
      const possibleTasks = taskDatabase.filter(task => 
        task.duration <= availableTime && !suggestedTaskIds.has(task.title)
      );

      // Priority scoring system
      const scoreTask = (task) => {
        let score = 0;
        
        // Goal alignment
        if (student.longTermGoal && task.goal === student.longTermGoal) score += 5;
        
        // Interest alignment
        if (student.interests?.includes(task.interest)) score += 3;
        
        // Priority level
        if (task.priority === 'high') score += 4;
        else if (task.priority === 'medium') score += 2;
        
        // Time of day optimization
        if (timeOfDay === 'morning' && task.priority === 'high') score += 2;
        if (timeOfDay === 'afternoon' && task.duration <= 45) score += 1;
        
        // Previous class context
        if (index > 0 && schedule[index - 1].type === 'class') {
          const prevClass = schedule[index - 1].title;
          if (task.interest?.toLowerCase().includes(prevClass.toLowerCase())) score += 3;
        }
        
        return score;
      };

      // Sort tasks by score and get the best match
      const scoredTasks = possibleTasks
        .map(task => ({ ...task, score: scoreTask(task) }))
        .sort((a, b) => b.score - a.score);

      suggestedTask = scoredTasks[0];
      
      if (suggestedTask) {
        suggestedTaskIds.add(suggestedTask.title);
      } else {
        // Fallback to generic tasks if no suitable task found
        suggestedTask = taskDatabase.find(task => 
          task.goal === null && 
          task.interest === null && 
          task.duration <= availableTime
        );
      }
      
      return { 
        ...period, 
        suggestedTask,
        timeOfDay,
        availableTime 
      };
    }
    return period;
  });
};

export default function StudentTimetablePage() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = React.useState(todayName);
  const [activeView, setActiveView] = React.useState('weekly'); // 'weekly' or 'daily'
  
  // Generate the personalized routine for the logged-in user based on selected day
  const personalizedRoutine = generateRoutineForStudent({
    ...user,
    schedule: timetableData[selectedDay] || []
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Your Schedule</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('weekly')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeView === 'weekly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Weekly Schedule
              </button>
              <button
                onClick={() => setActiveView('daily')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeView === 'daily'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Daily Routine
              </button>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            {selectedDay === todayName 
              ? "Today's schedule combines your classes with personalized activities."
              : `Viewing schedule for ${selectedDay}`
            }
          </p>
        </div>

        {/* Content Container */}
        <div className="grid grid-cols-1 gap-6">

        {/* Day Selector */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {dayNames.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${selectedDay === day 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  ${day === todayName ? 'ring-2 ring-blue-300' : ''}
                `}
              >
                {day}
                {day === todayName && (
                  <span className="ml-1 text-xs">
                    (Today)
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side: Weekly Schedule */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Weekly Schedule</h2>
            {personalizedRoutine.map((item, index) => {
            // --- This is a generated GOAL-ORIENTED TASK CARD ---
            if (item.type === 'free' && item.suggestedTask) {
              const priorityColor = {
                high: 'text-red-600',
                medium: 'text-orange-600',
                low: 'text-blue-600'
              }[item.suggestedTask.priority] || 'text-gray-600';

              return (
                <div key={index} className="bg-white border-blue-500 border-l-4 rounded-lg shadow-md p-5">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-500">{item.time}</p>
                    <span className={`text-sm font-medium ${priorityColor} bg-gray-100 px-3 py-1 rounded-full`}>
                      {item.suggestedTask.priority?.toUpperCase() || 'OPTIONAL'}
                    </span>
                  </div>
                  
                  <div className="flex items-start space-x-3 mt-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FlagIcon className="w-6 h-6 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{item.suggestedTask.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.suggestedTask.goal && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Goal: {item.suggestedTask.goal}
                          </span>
                        )}
                        {item.suggestedTask.interest && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Topic: {item.suggestedTask.interest}
                          </span>
                        )}
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {item.suggestedTask.duration} mins
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Best time for this task: {item.timeOfDay} | Available time: {item.availableTime} mins
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
            // --- This is a regular CLASS CARD ---
            if (item.type === 'class') {
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm p-5">
                  <p className="font-semibold text-gray-500">{item.time}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="bg-gray-100 p-2 rounded-full">
                       <BookOpenIcon className="w-6 h-6 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
          </div>
          
          {/* Right side: Daily Routine */}
          <div>
            <DailyRoutine 
              daySchedule={timetableData[selectedDay] || []}
              studentGoals={[user?.longTermGoal]}
              interests={user?.interests || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

