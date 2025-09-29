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