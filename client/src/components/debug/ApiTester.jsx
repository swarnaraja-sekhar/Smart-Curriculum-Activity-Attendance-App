import React, { useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

// This component can be temporarily added to a page to test API calls
const ApiTester = () => {
  const { user } = useAuth();
  const [results, setResults] = useState('No test run yet');
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState('auth');

  const runTest = async () => {
    setLoading(true);
    setResults('Running test...');
    
    try {
      let response;
      
      switch (selectedTest) {
        case 'auth':
          // Test authentication status
          response = await axios.get('/auth/status');
          break;
        
        case 'qr-session':
          // Test QR session creation with fallback values
          response = await axios.post('/qr/start-session', {
            classId: 'CSE-A',
            subjectId: 'CS101',
            period: 'morning'
          });
          break;
          
        case 'user-info':
          // Just output the current user info
          setResults(JSON.stringify(user, null, 2));
          setLoading(false);
          return;
          
        case 'token':
          // Output the current token
          const token = localStorage.getItem('token');
          setResults(token ? `Token found: ${token.substring(0, 15)}...` : 'No token found');
          setLoading(false);
          return;
          
        default:
          setResults('Unknown test type');
          setLoading(false);
          return;
      }
      
      setResults(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Test error:', error);
      
      if (error.response) {
        setResults(`Error ${error.response.status}: ${JSON.stringify(error.response.data, null, 2)}`);
      } else if (error.request) {
        setResults('No response received from server');
      } else {
        setResults(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">API Tester</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Test
        </label>
        <select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="auth">Authentication Status</option>
          <option value="qr-session">QR Session Creation</option>
          <option value="user-info">User Information</option>
          <option value="token">Check Token</option>
        </select>
      </div>
      
      <button
        onClick={runTest}
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:bg-blue-300"
      >
        {loading ? 'Running...' : 'Run Test'}
      </button>
      
      <div className="mt-4">
        <h3 className="text-md font-medium mb-2">Results:</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
          {results}
        </pre>
      </div>
    </div>
  );
};

export default ApiTester;