const app = require("./app");
const connectDb = require("./config/db");
const env = require("./config/env");

(async () => {
  try {
    await connectDb();
    console.log("MongoDB connected");
    app.listen(env.port, () => {
      console.log(`API running on port ${env.port}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
})();
