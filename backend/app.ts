import express from "express";
import cors from "cors";
import v1Routes from "./routes/v1/products.route";
import { errorHandler } from "./middlewares/errorHandler";
import { CORS_ORIGINS } from "./config";

const app = express();

// CORS configuration
const corsOptions = {
  origin: CORS_ORIGINS,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1", v1Routes);

app.use(errorHandler);

export default app;
