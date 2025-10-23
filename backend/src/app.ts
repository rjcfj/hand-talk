import express from "express";
import cors from "cors";
import analysisRoutes from "./routes/analysisRoutes";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api", analysisRoutes(null)); // <--- importante: () no final!

  return app;
}

export default createApp;
