import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware } from "http-proxy-middleware";

const PORT = 3000;
const JAVA_API_URL = process.env.JAVA_API_URL || "http://localhost:8080";

async function startServer() {
  const app = express();

  app.use(
    createProxyMiddleware({
      target: JAVA_API_URL,
      changeOrigin: true,
      pathFilter: ["/api/bookings", "/api/blocked-dates", "/api/calendar"],
    })
  );
  
  app.use(express.json());


  app.post("/api/contact", async (req, res) => {
    try {
      const contactMsg = {
        ...req.body,
        id: `contact_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        created_at: new Date().toISOString()
      };
      console.log(`[Contact] Received inquiry from ${contactMsg.name || 'Anonymous'} (${contactMsg.contact || 'No contact'}): "${contactMsg.subject || 'general'}"`);
      res.json({ success: true, data: contactMsg });
    } catch (err) {
      console.error("Error handling contact inquiry:", err);
      res.status(500).json({ error: "Failed to process inquiry" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${PORT} is in use; dev server instance running.`);
    } else {
      console.error("Server error event:", err);
    }
  });

  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer();
