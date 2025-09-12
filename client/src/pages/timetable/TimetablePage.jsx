import React from "react";

const TimetablePage = () => {
  const timetable = [
    { day: "Monday", schedule: "Math, Science, English, PE" },
    { day: "Tuesday", schedule: "Physics, Chemistry, History, Art" },
    { day: "Wednesday", schedule: "Math, Computer, English, Music" },
    { day: "Thursday", schedule: "Biology, Chemistry, Geography, Sports" },
    { day: "Friday", schedule: "Math, Science, Coding, Literature" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Timetable</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {timetable.map((item, index) => (
            <div key={index} className="bg-purple-100 p-4 rounded shadow hover:bg-purple-200">
              <h2 className="font-bold text-gray-700">{item.day}</h2>
              <p className="text-gray-600">{item.schedule}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
