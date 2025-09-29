const QrSession = require('../models/QrSession');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

/**
 * Handle student QR scan and mark attendance
 * Allows unlimited students to scan the same session
 */
exports.markAttendance = async (req, res) => {
  try {
    const { qrToken } = req.body;
    const studentId = req.user.id;

    console.log('QR Scan attempt:', { qrToken, studentId });

    if (!qrToken) {
      return res.status(400).json({ message: 'QR token is required.' });
    }

    // Extract base token from dynamic token (remove timestamp suffix)
    const baseToken = qrToken.split('_')[0];
    console.log('Base token extracted:', baseToken);

    // Find the active session
    const session = await QrSession.findOne({ 
      sessionToken: baseToken,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(404).json({ message: 'Invalid or expired QR code.' });
    }

    console.log('Found active session:', session._id);

    // Check if student already marked attendance for this session
    const existingAttendance = await Attendance.findOne({
      studentId: studentId,
      sessionToken: baseToken
    });

    if (existingAttendance) {
      // Update existing attendance to Present
      existingAttendance.status = 'Present';
      existingAttendance.scannedAt = new Date();
      await existingAttendance.save();
      
      console.log('Updated existing attendance to Present');
    } else {
      // Create new attendance record
      const newAttendance = new Attendance({
        studentId: studentId,
        classId: session.classId,
        subjectId: session.subjectId,
        facultyId: session.facultyId,
        date: new Date(),
        status: 'Present',
        period: session.period || '1',
        sessionToken: baseToken,
        scannedAt: new Date()
      });
      await newAttendance.save();
      
      console.log('Created new attendance record');
    }

    // Get student info for response
    const student = await Student.findById(studentId).select('name username');

    res.status(200).json({
      message: 'Attendance marked successfully!',
      student: student,
      timestamp: new Date().toLocaleTimeString()
    });

  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({
      message: 'Failed to mark attendance.',
      error: error.message
    });
  }
};

/**
 * Get live attendance statistics for a session
 */
exports.getAttendanceStats = async (req, res) => {
  try {
    const { token } = req.params;
    console.log('Fetching attendance stats for token:', token);

    // Find the active session
    const session = await QrSession.findOne({ 
      sessionToken: token,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(404).json({ message: 'Invalid or expired session' });
    }

    // Count students who marked attendance as Present
    const presentCount = await Attendance.countDocuments({
      sessionToken: token,
      status: 'Present'
    });

    // Get total students for this class (hardcoded for now, can be improved)
    const totalStudents = 50;
    const absentCount = totalStudents - presentCount;

    console.log(`Attendance stats: ${presentCount}/${totalStudents} present`);

    res.json({
      total: totalStudents,
      present: presentCount,
      absent: absentCount,
      sessionId: session._id,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch attendance stats',
      error: error.message 
    });
  }
};