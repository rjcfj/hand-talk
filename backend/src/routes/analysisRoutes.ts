// src/routes/analysisRoutes.ts
import { Router } from "express";
import { analyzePage, getResults } from "../controllers/analysisController";

const router = Router();

// Supondo que você tenha um objeto io do socket.io
export default (io: any) => {
  router.post("/analyze", (req, res) => analyzePage(req, res, io));
  router.get("/results", getResults);
  return router;
};
