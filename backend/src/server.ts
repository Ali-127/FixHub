import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes'

dotenv.config();

const app = express();

// Middlewares

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

// Reading req.body and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "FixHub api is running.",
  });
});

app.use('/api/auth', authRoutes)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
