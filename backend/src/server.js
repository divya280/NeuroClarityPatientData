import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
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

app.listen(PORT, () => {
  console.log(`\n--- NeuroClarity Hybrid Backend Running ---`);
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Using Service Account credentials.`);
  console.log(`\nRoutes Configured:`);
  console.log(`- Auth: /api/auth (signup, login, logout, me)`);
  console.log(`- Patients: /api/patients (CRUD, uploads)`);
});
