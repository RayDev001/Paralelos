const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

// 1. Proxy para /api/facturar (sin body parser antes)
app.use(
  '/api/facturar',
  createProxyMiddleware({
    target: 'http://nginx:80',
    changeOrigin: true,
    pathRewrite: { '^/api/facturar': '/process' },
    timeout: 30000,
    proxyTimeout: 30000,
    onProxyReq(proxyReq, req) {
      // Reinyectar el body JSON
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  })
);

// 2. Body parser para otras rutas si las tuvieras
app.use(express.json());

// 3. Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway está vivo' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway corriendo en http://0.0.0.0:${PORT}`);
});
