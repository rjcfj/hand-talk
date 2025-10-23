// src/controllers/analysisController.ts
import { Request, Response } from "express";
import puppeteer, { Browser } from "puppeteer";
import Analysis from "../models/Analysis";
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

    const analysis = await Analysis.create({ url, issues: results });

    emitStatus("done", "Concluído!");

    res.json({
      message: "Análise concluída!",
      total_issues: results.length,
      issues: results,
      saved: { id: analysis._id, url: analysis.url, date: analysis.date },
    });
  } catch (error: any) {
    console.error(error);
    emitStatus("error", "Erro durante análise.");
    res.status(500).json({ error: "Erro durante análise." });
  } finally {
    if (browser) await browser.close();
  }
};

// getResults não depende de io
export const getResults = async (_req: Request, res: Response) => {
  try {
    const results = await Analysis.find().sort({ date: -1 });
    res.json(
      results.map((r) => ({
        id: r._id.toString(),
        url: r.url,
        issues: r.issues,
        date: r.date,
      }))
    );
  } catch (err) {
    console.error("Erro em getResults:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
