import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { handleDemo } from "./routes/demo";

// Import route modules
import authRoutes from "./routes/auth";
import patientRoutes from "./routes/patients";
import dashboardRoutes from "./routes/dashboard";
import appointmentRoutes from "./routes/appointments";

export function createServer() {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:8080",
      credentials: true,
    }),
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Auth rate limiting (stricter)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth requests per windowMs
  });

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health check routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping, timestamp: new Date().toISOString() });
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
  });

  // API Routes
  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/patients", patientRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/appointments", appointmentRoutes);

  // Legacy demo route
  app.get("/api/demo", handleDemo);

  // Error handling middleware
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("API Error:", err);

      if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Invalid JSON payload" });
      }

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "File too large" });
      }

      res.status(500).json({
        error: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { details: err.message }),
      });
    },
  );

  // 404 handler for API routes
  app.use("/api/*", (_req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  return app;
}
