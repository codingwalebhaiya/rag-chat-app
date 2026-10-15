import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const PORT = env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
 