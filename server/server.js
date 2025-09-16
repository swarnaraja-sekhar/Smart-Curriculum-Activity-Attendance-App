require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app); // Create HTTP server from Express app

// Create WebSocket Server
const wss = new WebSocketServer({ server });

// Make wss available to routes
app.set('wss', { wss });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log('received: %s', message);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  ws.on('error', console.error);
});

const allowedOrigins = [
  "https://smart-curriculum-activit-git-8dd264-swarna-rajasekhars-projects.vercel.app",
  "https://server-3y45.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
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
  process.exit(1); // Exit if DB connection fails
});

const attendanceRoutes = require('./routes/attendance');
const authRoutes = require('./routes/auth');

app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);
app.get("/",(req,res)=>{
  res.send("Backend is running");
})
// Error handler (should be last middleware)
app.use(errorHandler);

server.listen(config.port, () => console.log(`Server running on http://localhost:${config.port}`));

// Export wss to be used in other parts of the app, like routes
module.exports = { wss };
