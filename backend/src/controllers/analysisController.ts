// src/controllers/analysisController.ts
import { Request, Response } from "express";
import puppeteer, { Browser } from "puppeteer";
import Analysis from "../models/Analysis";
import redisClient from "../config/redis";
import path from "path";

const axePath = path.resolve(
  __dirname,
  "../../node_modules/axe-core/axe.min.js"
);

export const analyzePage = async (req: Request, res: Response, io?: any) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL é obrigatória" });

  const emitStatus = (status: string, message: string) => {
    if (io) io.emit("analysisStatus", { status, message });
  };

  let browser: Browser | null = null;

  try {
    emitStatus("loading", "Carregando página...");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load", timeout: 30000 });

    emitStatus("analyzing", "Executando análise...");
    await page.addScriptTag({ path: axePath });

    const results = await page.evaluate(async () => {
      // @ts-ignore
      const { violations } = await axe.run();
      return violations.map((v: any) => ({
        id: v.id,
        description: v.description,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.map((n: any) => ({
          html: n.html,
          target: n.target,
          failureSummary: n.failureSummary,
        })),
      }));
    });

    emitStatus("saving", "Salvando resultados...");

    // 🔹 Salva no Redis (await!)
    await redisClient.set(`analysis:${url}`, JSON.stringify(results), {
      EX: 3600, // opcional: expira em 1 hora
    });

    // 🔹 Salva no MongoDB (await!)
    Analysis.create({ url, issues: results }).catch((err) =>
      console.error(err)
    );

    emitStatus("done", "Concluído!");

    res.json({
      message: "Análise concluída e salva!",
      total_issues: results.length,
      issues: results,
    });
  } catch (error: any) {
    console.error(error);
    emitStatus("error", "Erro durante análise.");
    res.status(500).json({ error: "Erro durante análise." });
  } finally {
    if (browser) await browser.close();
  }
};

export const getResults = async (req: Request, res: Response) => {
  const cacheKey = "analysis:all";
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    // 1️⃣ Tenta pegar do Redis
    const cached = await redisClient.get(cacheKey);
    let results;

    if (cached) {
      console.log("📌 Retornando resultados do cache Redis");
      results = JSON.parse(cached);
    } else {
      // 2️⃣ Busca do MongoDB
      const allResults = await Analysis.find().sort({ date: -1 });
      results = allResults.map((r) => ({
        id: r._id.toString(),
        url: r.url,
        issues: r.issues,
        date: r.date,
      }));

      // 3️⃣ Salva no Redis sem esperar
      redisClient
        .setEx(cacheKey, 30, JSON.stringify(results)) // cache 30s
        .catch((err) => console.error("Erro ao gravar cache Redis:", err));
    }

    // 4️⃣ Paginação
    const paginated = results.slice(skip, skip + limit);

    res.json({
      page,
      limit,
      total: results.length,
      totalPages: Math.ceil(results.length / limit),
      data: paginated,
    });
  } catch (err) {
    console.error("Erro em getResults:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
