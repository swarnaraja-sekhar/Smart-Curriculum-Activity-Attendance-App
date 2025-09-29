// Test script to verify attendance flow
const axios = require('axios');

const baseURL = 'http://localhost:5000/api';

async function testAttendanceFlow() {
  try {
    console.log('🚀 Testing Attendance Flow...\n');

    // 1. Create a session (simulating faculty)
    console.log('1. Creating QR session...');
    const sessionResponse = await axios.post(`${baseURL}/qr/start-session`, {
      classId: 'CS101',
      subjectId: 'Math',
      facultyId: 'faculty123'
    }, {
      headers: { Authorization: 'Bearer test-token' }
    });

    console.log('✅ Session created:', sessionResponse.data);
    const sessionToken = sessionResponse.data.sessionToken;

    // 2. Simulate student scanning QR (multiple students)
    console.log('\n2. Simulating student scans...');
    
    const students = ['student1', 'student2', 'student3'];
    
    for (let i = 0; i < students.length; i++) {
      const studentId = students[i];
      console.log(`   Scanning as ${studentId}...`);
      
      try {
        const scanResponse = await axios.post(`${baseURL}/qr/test/scan`, {
          qrToken: `${sessionToken}_${Date.now()}`
        });
        
        console.log(`   ✅ ${studentId} attendance marked`);
      } catch (error) {
        console.log(`   ❌ ${studentId} scan failed:`, error.response?.data?.message || error.message);
      }
      
      // Wait a bit between scans
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 3. Check attendance stats
    console.log('\n3. Checking attendance statistics...');
    const statsResponse = await axios.get(`${baseURL}/qr/test/attendance/${sessionToken}`);

    console.log('📊 Attendance Stats:', statsResponse.data);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAttendanceFlow();