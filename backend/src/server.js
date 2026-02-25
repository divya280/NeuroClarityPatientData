import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Flexible CORS for Vercel and Development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://neuro-clarity-patient-data-zw63.vercel.app" // Direct link as fallback
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Diagnostics and Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  
  if (req.method === 'OPTIONS') {
    console.log("Preflight Request Received from:", req.headers.origin);
  }
  next();
});

// Environment Status Route
app.get("/api/sys-status", (req, res) => {
  res.json({
    status: "ok",
    env: {
      has_service_account: !!process.env.FIREBASE_SERVICE_ACCOUNT,
      frontend_url: process.env.FRONTEND_URL || "NOT_SET",
      node_env: process.env.NODE_ENV
    }
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "NeuroClarity API" });
});

// Root Route
app.get("/", (req, res) => {
  res.send(`
    <h1 style="color: #2563eb; font-family: sans-serif;">NeuroClarity API is Running</h1>
    <p style="font-family: sans-serif;">The server is active. Please use the following endpoints:</p>
    <ul style="font-family: sans-serif;">
      <li>Health Check: <a href="/health">/health</a></li>
      <li>Auth API: <code>/api/auth</code></li>
      <li>Patients API: <code>/api/patients</code></li>
    </ul>
    <p style="font-family: sans-serif;">Check <code>walkthrough.md</code> for full documentation.</p>
  `);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Critical Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// For Vercel, we export the app
export default app;

// Only listen if not running in a serverless environment (determined by presence of PORT or running via direct node call)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`\n--- NeuroClarity Hybrid Backend Running ---`);
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Using Service Account credentials.`);
    console.log(`\nRoutes Configured:`);
    console.log(`- Auth: /api/auth (signup, login, logout, me)`);
    console.log(`- Patients: /api/patients (CRUD, uploads)`);
  });
}
