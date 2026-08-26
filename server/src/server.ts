import app from "./app.js";
import { connectDB } from "./config/db.js";
import http from "http";
import { initializeSocket } from "./config/socket.js";


const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// initialize socket.io
initializeSocket(server);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

