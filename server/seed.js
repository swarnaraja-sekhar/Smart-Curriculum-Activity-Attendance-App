const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const studentData = require('../client/src/data/studentData.json');
const facultyData = require('../client/src/data/facultyData.json');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const College = require('./models/College');
const Admin = require('./models/Admin');

require('dotenv').config({ path: './.env' });


const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await College.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared existing data.');

    // Create a default college
    const college = new College({
      name: 'Smart India University',
      branches: ['Computer Science & Engineering', 'Electronics & Communication', 'Information Technology'],
      classes: ['CSE-A', 'CSE-B', 'ECE-A', 'ECE-B', 'IT-A', 'IT-B'],
    });
    await college.save();
    console.log('Default college created.');

    // Create a default admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
        name: 'Default Admin',
        email: 'admin@sih.com',
        password: adminPassword,
        college: college._id,
    });
    await admin.save();
    console.log('Default admin created.');
    
    // Update college with admin reference
    college.createdBy = admin._id;
    await college.save();


    // Seed students
    for (const s of studentData) {
      const hashedPassword = await bcrypt.hash(s.password, 10);
      const student = new Student({
        ...s,
        password: hashedPassword,
        college: college._id,
      });
      await student.save();
    }
    console.log(`${studentData.length} students seeded.`);

    // Seed faculty
    for (const f of facultyData) {
      const hashedPassword = await bcrypt.hash(f.password, 10);
      const faculty = new Faculty({
        name: f.name,
        username: f.username,
        password: hashedPassword,
        college: college._id,
        branch: f.department, // Map department to branch
        classIds: f.classIds, // Assign the array directly
        isHOD: f.isHOD || false, // Add isHOD field
      });
      await faculty.save();
    }
    console.log(`${facultyData.length} faculty seeded.`);

    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
