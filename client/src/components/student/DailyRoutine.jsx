import React, { useMemo } from 'react';
import { CalendarIcon, AcademicCapIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline';

// Daily slots from 4:30 AM to 10:00 PM
const timeSlots = [
  { time: "04:30 AM - 05:30 AM", type: "morning-routine", defaultActivity: "Wake up & Fresh up" },
  { time: "05:30 AM - 06:30 AM", type: "exercise", defaultActivity: "Physical Exercise / Yoga" },
  { time: "06:30 AM - 07:30 AM", type: "preparation", defaultActivity: "Breakfast & Class Preparation" },
  { time: "07:30 AM - 08:45 AM", type: "study", defaultActivity: "Self Study" },
  { time: "08:45 AM - 09:00 AM", type: "travel", defaultActivity: "Travel to College" },
  // College hours will be filled from timetable.json
  { time: "04:00 PM - 05:00 PM", type: "break", defaultActivity: "Evening Break & Refreshment" },
  { time: "05:00 PM - 06:30 PM", type: "self-study", defaultActivity: "Self Study / Assignments" },
  { time: "06:30 PM - 07:30 PM", type: "exercise", defaultActivity: "Sports / Exercise" },
  { time: "07:30 PM - 08:30 PM", type: "dinner", defaultActivity: "Dinner & Break" },
  { time: "08:30 PM - 10:00 PM", type: "preparation", defaultActivity: "Next Day Preparation & Study" }
];

const activityColors = {
  'morning-routine': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: SparklesIcon },
  'exercise': { bg: 'bg-green-100', text: 'text-green-800', icon: SparklesIcon },
  'preparation': { bg: 'bg-blue-100', text: 'text-blue-800', icon: BookOpenIcon },
  'study': { bg: 'bg-purple-100', text: 'text-purple-800', icon: AcademicCapIcon },
  'travel': { bg: 'bg-gray-100', text: 'text-gray-800', icon: CalendarIcon },
  'break': { bg: 'bg-orange-100', text: 'text-orange-800', icon: SparklesIcon },
  'self-study': { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: BookOpenIcon },
  'dinner': { bg: 'bg-red-100', text: 'text-red-800', icon: SparklesIcon },
  'class': { bg: 'bg-blue-100', text: 'text-blue-800', icon: AcademicCapIcon }
};

const DailyRoutine = ({ daySchedule, studentGoals = [], interests = [] }) => {
  const routine = useMemo(() => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    
    return timeSlots.map(slot => {
      const [startTime] = slot.time.split(' - ')[0].split(' ')[0].split(':').map(Number);
      
      // Check if this time slot overlaps with any classes from the day schedule
      const classSchedule = daySchedule?.find(ds => {
        const [classStart] = ds.time.split(' - ')[0].split(' ')[0].split(':').map(Number);
        return classStart === startTime;
      });

      if (classSchedule) {
        return {
          ...slot,
          type: 'class',
          activity: classSchedule.title,
          isClass: true
        };
      }

      // Customize activities based on student goals and interests
      let activity = slot.defaultActivity;
      if (slot.type === 'study' || slot.type === 'self-study') {
        if (studentGoals.includes('GATE')) {
          activity = startTime < 12 ? 'GATE Preparation - Core Subjects' : 'GATE Practice Problems';
        } else if (studentGoals.includes('Placement')) {
          activity = startTime < 12 ? 'Coding Practice' : 'Technical Interview Preparation';
        }
      }

      // Factor in the time of day for activity optimization
      const isPastTime = currentHour >= startTime;
      
      return {
        ...slot,
        activity,
        isPastTime
      };
    });
  }, [daySchedule, studentGoals, interests]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Routine</h2>
      <div className="space-y-3">
        {routine.map((slot, index) => {
          const style = activityColors[slot.type];
          const Icon = style.icon;
          
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                slot.isClass ? 'border-blue-200 bg-blue-50' : 'border-gray-100 hover:border-blue-200 transition-colors'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`${style.bg} p-2 rounded-full`}>
                  <Icon className={`w-5 h-5 ${style.text}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900">{slot.time}</p>
                    {slot.isClass && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        Class
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${style.text} font-medium mt-1`}>
                    {slot.activity}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyRoutine;
