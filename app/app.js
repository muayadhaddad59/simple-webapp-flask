const express = require('express');
const app = express();

const quotes = [
  "Move fast, don’t break prod.",
  "Automate what hurts, then everything else.",
  "Ship small, ship often.",
  "Infra is code — treat it that way.",
  "You build it, you run it."
];

app.get('/', (_req, res) => {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  res.send(`
    <html>
      <head>
        <title>QuoteBoard</title>
        <style>
          body { font-family: -apple-system, Segoe UI, Roboto, Helvetica;
                 background:#0f172a; color:#e2e8f0; display:flex; align-items:center;
                 justify-content:center; height:100vh; margin:0; }
          .card { background:#111827; padding:28px 32px; border-radius:18px;
                  box-shadow:0 10px 30px rgba(0,0,0,.4); text-align:center; }
          h1 { margin:0 0 8px 0; font-size:28px; }
          p { margin:6px 0 0 0; color:#94a3b8; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>“${q}”</h1>
          <p>GitHub → Jenkins (Docker) CI</p>
        </div>
      </body>
    </html>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`QuoteBoard listening on ${port}`));
