const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// Student Login
router.post('/student/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('\n--- Student Login Attempt ---');
  console.log('Received username:', username);
  console.log('Received password:', password ? '********' : '(empty)');

  try {
    // Find student by username
    const student = await Student.findOne({ username });
    if (!student) {
      console.log('DEBUG: Student not found in database.');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('DEBUG: Student found in database:', student.username);

    // Check password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      console.log('DEBUG: Password comparison failed. Passwords do not match.');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('DEBUG: Password comparison successful.');

    // Password is correct, create JWT
    const userPayload = student.toObject();
    delete userPayload.password; // Ensure password hash is not sent

    const payload = {
      user: {
        id: student.id,
        role: 'student',
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        // Return the token and the full user object (without password)
        res.json({ token, user: userPayload });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Faculty Login
router.post('/faculty/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('\n--- Faculty Login Attempt ---');
    console.log('Received username:', username);
    console.log('Received password:', password ? '********' : '(empty)');
  
    try {
      // Find faculty by username
      const faculty = await Faculty.findOne({ username });
      if (!faculty) {
        console.log('DEBUG: Faculty not found in database.');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      console.log('DEBUG: Faculty found in database:', faculty.username);
  
      // Check password
      const isMatch = await bcrypt.compare(password, faculty.password);
      if (!isMatch) {
        console.log('DEBUG: Password comparison failed. Passwords do not match.');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      console.log('DEBUG: Password comparison successful.');
  
      // Password is correct, create JWT
      const userPayload = faculty.toObject();
      delete userPayload.password; // Ensure password hash is not sent

      const payload = {
        user: {
          id: faculty.id,
          role: 'faculty',
        },
      };
  
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          // Return the token and the full user object (without password)
          res.json({ token, user: userPayload });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
