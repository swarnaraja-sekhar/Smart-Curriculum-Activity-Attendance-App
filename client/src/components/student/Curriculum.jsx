import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import subjectsData from '../../data/subjects.json';
import studentData from '../../data/studentData.json';
import { AcademicCapIcon, CalendarIcon, BookOpenIcon, ChevronDownIcon, UserCircleIcon, BuildingLibraryIcon, IdentificationIcon, AtSymbolIcon } from '@heroicons/react/24/outline';

const Curriculum = () => {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [curriculum, setCurriculum] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    if (user) {
      const student = studentData.find(s => s.username === user.username);
      setStudentInfo(student);
      
      if (user.username) {
        const admissionYear = parseInt(user.username.substring(1, 3), 10);
        const currentAcademicYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        
        let yearOfStudy = currentAcademicYear - (2000 + admissionYear);
        
        if (currentMonth < 7 && yearOfStudy > 0) {
            yearOfStudy--;
        }

        if (yearOfStudy > 0) {
            setSelectedYear(`year-${yearOfStudy}`);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedYear && selectedSem) {
      setCurriculum(subjectsData[selectedYear]?.[selectedSem] || []);
    } else {
      setCurriculum([]);
    }
  }, [selectedYear, selectedSem]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedSem('');
    setCurriculum([]);
  };

  const handleSemChange = (e) => {
    setSelectedSem(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 flex items-center justify-center">
            <AcademicCapIcon className="w-10 h-10 mr-4 text-blue-600" />
            Course Curriculum
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Your academic journey, semester by semester.
          </p>
        </div>

        {studentInfo && (
          <div className="bg-white bg-opacity-70 backdrop-blur-lg shadow-2xl rounded-3xl p-8 mb-10 border border-gray-200 transform transition-all duration-500 hover:scale-105">
            <div className="flex items-center mb-6">
              <UserCircleIcon className="w-16 h-16 text-blue-500 mr-6"/>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{studentInfo.name}</h2>
                <p className="text-lg text-gray-500">{studentInfo.branch}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
              <div className="flex items-center"><IdentificationIcon className="w-5 h-5 mr-3 text-blue-400"/><span className="font-semibold">Class ID:</span><span className="ml-2">{studentInfo.classId}</span></div>
              <div className="flex items-center"><BuildingLibraryIcon className="w-5 h-5 mr-3 text-blue-400"/><span className="font-semibold">University:</span><span className="ml-2">{studentInfo.university}</span></div>
              <div className="flex items-center"><AtSymbolIcon className="w-5 h-5 mr-3 text-blue-400"/><span className="font-semibold">Username:</span><span className="ml-2">{studentInfo.username}</span></div>
            </div>
          </div>
        )}

        <div className="bg-white bg-opacity-70 backdrop-blur-lg shadow-xl rounded-3xl p-8 mb-10 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <label htmlFor="year-select" className="flex items-center text-lg font-semibold text-gray-800 mb-2">
                <CalendarIcon className="w-6 h-6 mr-3 text-blue-500" />
                Select Year
              </label>
              <div className="relative">
                <select 
                  id="year-select" 
                  value={selectedYear} 
                  onChange={handleYearChange} 
                  className="appearance-none w-full bg-gray-50 border-2 border-gray-300 text-gray-700 py-4 px-5 pr-10 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition-all duration-300"
                >
                  <option value="">-- Select a Year --</option>
                  {Object.keys(subjectsData).map(year => (
                    <option key={year} value={year}>{`Year ${year.split('-')[1]}`}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <ChevronDownIcon className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="relative">
              <label htmlFor="sem-select" className="flex items-center text-lg font-semibold text-gray-800 mb-2">
                <BookOpenIcon className="w-6 h-6 mr-3 text-blue-500" />
                Select Semester
              </label>
              <div className="relative">
                <select 
                  id="sem-select" 
                  value={selectedSem} 
                  onChange={handleSemChange} 
                  disabled={!selectedYear} 
                  className="appearance-none w-full bg-gray-50 border-2 border-gray-300 text-gray-700 py-4 px-5 pr-10 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition-all duration-300 disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                  <option value="">-- Select a Semester --</option>
                  {selectedYear && Object.keys(subjectsData[selectedYear] || {}).map(sem => (
                    <option key={sem} value={sem}>{`Semester ${sem.split('-')[1]}`}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <ChevronDownIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {curriculum.length > 0 ? (
            <div className="overflow-hidden shadow-2xl rounded-3xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Subject ID</th>
                      <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Subject Name</th>
                      <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Credits</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {curriculum.map((subject, index) => (
                      <tr key={subject.id} className={`transition-all duration-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-100`}>
                        <td className="px-8 py-5 whitespace-nowrap text-md font-medium text-gray-800">{subject.id}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-md text-gray-600">{subject.name}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-md text-gray-800 font-bold">{subject.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            selectedYear && selectedSem && (
              <div className="text-center p-16 bg-white bg-opacity-70 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200">
                <AcademicCapIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">No Subjects Found</h3>
                <p className="mt-2 text-md text-gray-500">There are no subjects listed for the selected year and semester.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Curriculum;
