require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

// Optional: Socket.io integration
// const io = require("socket.io")(server, { cors: { origin: "*" } });
// require("./sockets/attendanceSocket")(io);

server.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));
