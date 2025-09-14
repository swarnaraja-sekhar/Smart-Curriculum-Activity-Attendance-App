import React from 'react';
// 1. Import 'useSearchParams' to read the URL
import { useSearchParams } from 'react-router-dom';
import { SparklesIcon, FunnelIcon } from '@heroicons/react/24/outline';

// Updated mock data with categories that match our notification links
const allTasksList = [
  { id: 1, title: "Python Algorithm Practice", category: "algorithms", time: "30 min" },
  { id: 2, title: "SQL Query Optimization", category: "database", time: "45 min" },
  { id: 3, title: "Write SIH Project Documentation", category: "project", time: "1 hour" },
  { id: 4, title: "Binary Tree Traversal Problem", category: "algorithms", time: "45 min" },
  { id: 5, title: "Normalize 3NF Database Schema", category: "database", time: "1 hour" },
];

export default function StudentTaskPage() {
  // 2. Get the URL search parameters
  const [searchParams] = useSearchParams();
  const selectedTopic = searchParams.get('topic'); // This will be 'algorithms', 'database', or null

  // 3. Filter the task list based on the selected topic
  const filteredTasks = selectedTopic
    ? allTasksList.filter(task => task.category === selectedTopic)
    : allTasksList; // If no topic, show all tasks

  // 4. Create a dynamic title
  const pageTitle = selectedTopic 
    ? `Tasks for: ${selectedTopic}`
    : "All Suggested Tasks";

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center space-x-3 mb-6">
          {selectedTopic ? (
            <FunnelIcon className="w-8 h-8 text-blue-600" />
          ) : (
            <SparklesIcon className="w-8 h-8 text-blue-600" />
          )}
          {/* 5. The title is now dynamic */}
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {pageTitle}
          </h1>
        </div>
        
        <p className="text-lg text-gray-600 mb-6">
          {selectedTopic 
            ? `Here are tasks specifically related to ${selectedTopic}.`
            : "Here are all suggested tasks for your free time. Choose one to start."
          }
        </p>

        {/* 6. The list now renders the filtered tasks */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full capitalize">{task.category}</span>
                <p className="text-xl font-bold text-gray-900 mt-2">{task.title}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">{task.time}</p>
                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Start
                </button>
              </div>
            </div>
          ))}
          
          {/* If the filter returns no results */}
          {filteredTasks.length === 0 && (
             <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="font-semibold text-gray-700">No tasks found for the category: "{selectedTopic}"</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
