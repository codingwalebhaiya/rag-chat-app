import { connectDB } from "../config/db.js";
import express from 'express';
import { env } from '../config/env.js';

const app = express();
const PORT = env.PORT;

// Render Health Check endpoint (Mandatory)
app.get('/healthz', (req, res) => {
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`🤖 Worker port-binding helper listening on port ${PORT}`);
});


// first - connect to mongodb
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected for worker");
    // then start the worker server
    import("./docs.worker.js");
    console.log("✅ Document worker started");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
