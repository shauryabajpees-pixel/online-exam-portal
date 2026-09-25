import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const distPath = path.resolve(process.cwd(), 'dist');

// Body parsing middleware
app.use(express.json());

// API health endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'EvalScript - Online Examination Portal',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    nodeVersion: process.version
  });
});

// Serve compiled static files if available
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Fallback for development if dist has not been generated yet
  app.get('*', (req: Request, res: Response) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>EvalScript Portal Server</title>
          <style>
            body { background: #020617; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #0f172a; border: 1px solid #1e293b; padding: 32px; border-radius: 16px; text-align: center; max-width: 480px; }
            h1 { font-size: 20px; margin-bottom: 8px; color: #38bdf8; }
            p { font-size: 14px; color: #94a3b8; line-height: 1.6; }
            code { background: #020617; padding: 4px 8px; border-radius: 6px; color: #38bdf8; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>EvalScript Node.js Server</h1>
            <p>The backend server is active on port ${PORT}. Run <code>npm run build</code> to compile client assets.</p>
          </div>
        </body>
      </html>
    `);
  });
}

// Graceful listener with error handling
export const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[EvalScript] Node.js server running on http://0.0.0.0:${PORT}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[EvalScript] Port ${PORT} is in use; continuing without crashing.`);
  } else {
    console.error('[EvalScript] Server error:', err);
  }
});

export default app;
