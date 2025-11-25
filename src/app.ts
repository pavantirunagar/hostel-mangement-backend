import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import globalErrorHandler from "./middlewares/error.middleware";
import authRoutes from "./routes/authRoutes";
import studentRoutes from "./routes/studentRoutes";
import roomRoutes from "./routes/roomRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", studentRoutes);
app.use("/api", roomRoutes);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);




app.use(globalErrorHandler);

export default app;
