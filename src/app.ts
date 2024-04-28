import express, { Express } from "express";
import dotenv from "dotenv";
import bookRoutes from "./routes/book.routes";
import userRoutes from "./routes/user.routes";
import reservationRoutes from "./routes/reservation.routes";
import multer from "multer";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import connectDB from "./databases";
import "./services/scheduler";

dotenv.config();

const app: Express = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  multer({
    limits: { fieldSize: 25 * 1024 * 1024 },
    dest: "uploads/",
  }).single("file")
);

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => {
  res.send(`Version ${process.env.npm_package_version}`);
});
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);

export { app };
