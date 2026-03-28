import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database for audit logs and decisions
  const decisions: any[] = [];
  const auditLogs: any[] = [];

  // API routes
  app.post("/api/analyze", (req, res) => {
    const { scenario, userContext } = req.body;
    
    // In a real app, this would call the Gemini API
    // For now, we'll return a structured response that the frontend can handle
    // The frontend will actually perform the Gemini call for the "AI" part
    // but the backend handles the "Audit" and "Storage"
    
    const decisionId = Date.now().toString();
    const decision = {
      id: decisionId,
      scenario,
      userContext,
      timestamp: new Date().toISOString(),
      status: "Pending AI Analysis"
    };
    
    decisions.push(decision);
    
    auditLogs.push({
      id: Date.now().toString(),
      action: "SCENARIO_SUBMITTED",
      userId: userContext?.userId || "anonymous",
      timestamp: new Date().toISOString(),
      details: `Scenario submitted for analysis: ${decisionId}`
    });

    res.json(decision);
  });

  app.get("/api/decisions", (req, res) => {
    res.json(decisions);
  });

  app.get("/api/audit-logs", (req, res) => {
    res.json(auditLogs);
  });

  app.post("/api/audit-logs", (req, res) => {
    const log = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...req.body
    };
    auditLogs.push(log);
    res.json(log);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
