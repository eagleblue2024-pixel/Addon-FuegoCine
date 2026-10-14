/**
 * FuegoCine Addon para Nuvio y Stremio
 * Compatible con Render, Railway, VPS y Docker
 */
import express from 'express';
import { fetchPosts, getMeta, getStreams } from './scraper.js';

const app = express();
const PORT = process.env.PORT || 7000;

// Manifest del Addon para Nuvio y Stremio
const MANIFEST = {
  id: "community.fuegocine.addon",
  version: "1.0.0",
  name: "FuegoCine (Latino & Castellano)",
  description: "Películas, series y anime en Español Latino y Castellano en HD y 1080p directo desde FuegoCine.com sin publicidad molesta.",
  resources: ["catalog", "meta", "stream"],
  types: ["movie", "series"],
  catalogs: [
    {
      type: "movie",
      id: "fuegocine-movies",
      name: "FuegoCine - Películas",
      extra: [
        { name: "search", isRequired: false },
        { 
          name: "genre", 
          isRequired: false, 
          options: [
            "Acción", "Animación", "Aventura", "Ciencia ficción", 
            "Comedia", "Crimen", "Drama", "Familia", 
            "Fantasía", "Misterio", "Romance", "Suspenso", "Terror"
          ] 
        },
        { name: "skip", isRequired: false }
      ]
    },
    {
      type: "series",
      id: "fuegocine-series",
      name: "FuegoCine - Series & Anime",
      extra: [
        { name: "search", isRequired: false },
        { 
          name: "genre", 
          isRequired: false, 
          options: [
            "Acción", "Animación", "Aventura", "Ciencia ficción", 
            "Comedia", "Crimen", "Drama", "Familia", 
            "Fantasía", "Misterio", "Romance", "Suspenso", "Terror"
          ] 
        },
        { name: "skip", isRequired: false }
      ]
    }
  ],
  idPrefixes: ["fc:", "tt", "tmdb:"],
  background: "https://image.tmdb.org/t/p/original/cVLW11x4jwW4SveUyHrkAUztjRm.jpg",
  logo: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&auto=format&fit=crop&q=80"
};

// Habilitar CORS para que Nuvio y Stremio puedan comunicarse sin bloqueos
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Endpoint del Manifest
app.get("/manifest.json", (req, res) => {
  res.json(MANIFEST);
});

// Endpoint del Catálogo
app.get(["/catalog/:type/:id.json", "/catalog/:type/:id/:extra.json"], async (req, res) => {
  const { type, id, extra } = req.params;
  
  let genre = undefined;
  let search = undefined;
  let skip = 0;

  if (extra) {
    const pairs = extra.split("&");
    for (const pair of pairs) {
      const [k, v] = pair.split("=");
      if (k === "genre") genre = decodeURIComponent(v);
      if (k === "search") search = decodeURIComponent(v);
      if (k === "skip") skip = parseInt(v, 10) || 0;
    }
  }

  // Soporte query params también (?search=...&genre=...)
  if (req.query.search) search = String(req.query.search);
  if (req.query.genre) genre = String(req.query.genre);
  if (req.query.skip) skip = parseInt(String(req.query.skip), 10) || 0;

  try {
    const metas = await fetchPosts({
      type: type === "series" ? "series" : "movie",
      genre,
      search,
      skip,
      limit: 24
    });
    res.json({ metas });
  } catch (error) {
    console.error("Error en catalogo:", error);
    res.json({ metas: [] });
  }
});

// Endpoint de Metadata
app.get("/meta/:type/:id.json", async (req, res) => {
  const { type, id } = req.params;
  try {
    const meta = await getMeta(type, id);
    if (!meta) {
      return res.status(404).json({ meta: null });
    }
    res.json({ meta });
  } catch (error) {
    console.error("Error en meta:", error);
    res.status(500).json({ meta: null });
  }
});

// Endpoint de Streams
app.get("/stream/:type/:id.json", async (req, res) => {
  const { type, id } = req.params;
  try {
    const streams = await getStreams(type, id);
    res.json({ streams });
  } catch (error) {
    console.error("Error en streams:", error);
    res.json({ streams: [] });
  }
});

// Health check para Render
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Landing page interactiva
app.get("/", (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");
  const fullUrl = `${protocol}://${host}`;
  const manifestUrl = `${fullUrl}/manifest.json`;

  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FuegoCine Addon para Nuvio & Stremio</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #090d16;
      color: #f1f5f9;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 1rem;
      max-width: 600px;
      width: 90%;
      padding: 2.5rem;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
      text-align: center;
    }
    .badge {
      display: inline-block;
      background: #ef4444;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }
    h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      color: #ffffff;
    }
    p {
      color: #94a3b8;
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
    }
    .url-box {
      background: #030712;
      border: 1px solid #374151;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-family: monospace;
      color: #38bdf8;
      word-break: break-all;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }
    .btn-group {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
    }
    .btn-primary {
      background: #ef4444;
      color: white;
    }
    .btn-primary:hover {
      background: #dc2626;
    }
    .btn-secondary {
      background: #6366f1;
      color: white;
    }
    .btn-secondary:hover {
      background: #4f46e5;
    }
    .btn-outline {
      background: #1f2937;
      color: #e2e8f0;
      border: 1px solid #374151;
    }
    .btn-outline:hover {
      background: #374151;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Nuvio & Stremio Addon</span>
    <h1>FuegoCine Addon</h1>
    <p>Películas, series y anime en Español Latino y Castellano en calidad Full HD directamente desde FuegoCine.com.</p>
    
    <div class="url-box" id="manifestUrl">${manifestUrl}</div>

    <div class="btn-group">
      <a href="stremio://${host}/manifest.json" class="btn btn-primary">Instalar en Stremio</a>
      <a href="nuvio://${host}/manifest.json" class="btn btn-secondary">Instalar en Nuvio</a>
      <button onclick="navigator.clipboard.writeText('${manifestUrl}'); alert('¡URL del manifest copiada al portapapeles!');" class="btn btn-outline">Copiar URL</button>
    </div>
  </div>
</body>
</html>
  `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[FuegoCine Addon] Servidor iniciado en http://0.0.0.0:${PORT}`);
  console.log(`[FuegoCine Addon] Manifest disponible en http://0.0.0.0:${PORT}/manifest.json`);
});
