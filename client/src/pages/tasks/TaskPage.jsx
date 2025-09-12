import React from "react";

const TaskPage = () => {
  const tasks = [
    { id: 1, title: "Math Challenge", description: "Solve 10 advanced problems." },
    { id: 2, title: "Science Quiz", description: "Complete the weekly quiz." },
    { id: 3, title: "Coding Practice", description: "Implement a small React project." },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Tasks / Challenges</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-green-100 p-4 rounded shadow hover:bg-green-200">
              <h2 className="font-bold text-gray-700">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
