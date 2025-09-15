require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const attendanceRoutes = require('./routes/attendance');
const authRoutes = require('./routes/auth');

app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);

// Error handler (should be last middleware)
app.use(errorHandler);

app.listen(config.port, () => console.log(`Server running on http://localhost:${config.port}`));
