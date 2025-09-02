// server/index.js
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import eventsRouter from "./routes/events.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Debug environment variables
console.log("🔧 Environment Variables Check:");
console.log(
  "SUPABASE_URL:",
  process.env.SUPABASE_URL ? "✅ Loaded" : "❌ Missing"
);
console.log(
  "SUPABASE_SERVICE_ROLE_KEY:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Loaded" : "❌ Missing"
);
console.log("PORT:", process.env.PORT || "Using default");

// If env vars are missing, show what we have
if (!process.env.SUPABASE_URL) {
  console.log(
    "🚨 All env vars:",
    Object.keys(process.env).filter((key) => key.includes("SUPABASE"))
  );
}

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["https://clubs-connect-api.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Only create Supabase client if env vars exist
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing Supabase environment variables!");
  process.exit(1);
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log("✅ Supabase client created successfully");

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/events", eventsRouter);

// ✅ Export app for testing
export default app;

// Only start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}
