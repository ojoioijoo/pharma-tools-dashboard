import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Τοπικό dev-only υποκατάστατο του `vercel dev`: τρέχει τα ίδια αρχεία του /api
// μέσα στη διεργασία του Vite, ώστε `npm run dev` να αρκεί για full-stack testing
// χωρίς Vercel CLI / login. Στο production build δεν έχει καμία επίδραση —
// το πραγματικό deploy σερβίρει το /api ως Vercel serverless functions κανονικά.
function apiDevPlugin() {
  return {
    name: 'local-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next();

        const url = new URL(req.url, 'http://localhost');
        const routeName = url.pathname.replace('/api/', '').split('/')[0];
        const filePath = path.resolve(__dirname, 'api', `${routeName}.js`);
        if (!fs.existsSync(filePath)) return next();

        try {
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const raw = Buffer.concat(chunks).toString('utf8');
            req.body = raw ? JSON.parse(raw) : {};
          }
          req.query = Object.fromEntries(url.searchParams);

          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

          const mod = await import(`${pathToFileURL(filePath).href}?t=${Date.now()}`);
          await mod.default(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    plugins: [react(), apiDevPlugin()],
  };
});
