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

// Create WebSocket Server with better configuration
const wss = new WebSocketServer({ 
  server,
  path: '/ws',
  // Add these options for better connection handling
  clientTracking: true,
  perMessageDeflate: false,
  maxPayload: 16 * 1024, // 16KB max payload
  // Heartbeat configuration
  heartbeat: true
});

// Make wss available to routes
app.set('wss', { wss });

// Store active connections
const activeConnections = new Set();

wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected from:', req.socket.remoteAddress);
  
  // Add to active connections
  activeConnections.add(ws);
  
  // Set up heartbeat
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to attendance system',
    timestamp: new Date().toISOString()
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('WebSocket message received:', data);
      
      // Echo back for testing
      ws.send(JSON.stringify({
        type: 'echo',
        data: data,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('WebSocket message parse error:', error);
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`WebSocket client disconnected. Code: ${code}, Reason: ${reason}`);
    activeConnections.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    activeConnections.delete(ws);
  });
});

// Heartbeat to detect broken connections
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log('Terminating dead WebSocket connection');
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping();
  });
}, 30000); // Check every 30 seconds

// Clean up on server shutdown
wss.on('close', () => {
  clearInterval(heartbeatInterval);
});

const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://localhost:5174", // Local development (alt port)
  "http://localhost:5001", // Local backend
  "https://smart-curriculum-activity-attendance-app.vercel.app",
  "https://smart-curriculum-activity-attendanc-rosy.vercel.app",
  "https://smart-curriculum-activit-git-8dd264-swarna-rajasekhars-projects.vercel.app",
  "https://smart-curriculum-activity-attendance-app.onrender.com",
  "https://smart-curriculum-activity-attendance-app-up5p.onrender.com"
];

// More robust CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Check if origin is a subdomain of allowed origins
    for (const allowedOrigin of allowedOrigins) {
      if (origin.startsWith(allowedOrigin.replace(/^https?:\/\//, ''))) {
        return callback(null, true);
      }
    }
    
    console.log(`CORS blocked request from origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
  console.error('MongoDB connection error:', err.message);
  console.error('Full error details:', err);
  // Don't exit immediately in production to allow troubleshooting
  if (process.env.NODE_ENV === 'production') {
    console.error('MongoDB connection failed in production, but keeping server running for debugging');
  } else {
    process.exit(1); // Exit only in development
  }
});

const attendanceRoutes = require('./routes/attendance');
const authRoutes = require('./routes/auth');
const qrRoutes = require('./routes/qr'); // Import the new QR routes

app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes); // Use the new QR routes

app.get("/",(req,res)=>{
  res.send("Backend is running");
})
// Error handler (should be last middleware)
app.use(errorHandler);

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export wss to be used in other parts of the app, like routes
module.exports = { wss };
