import { Router, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    APP_NAME: process.env.APP_NAME || "MyApp",
    APP_VERSION: process.env.APP_VERSION || "1.0.0",
    DEVELOPED_BY: "Ricardo Junior", // altere conforme necessário
    COPYRIGHT: `All rights reserved © ${new Date().getFullYear()}`,
  });
});

export default router;
