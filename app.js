const express = require('express');
const { notFound, errorHandler } = require('./src/middlewares/errorHandler');
const orderRoutes = require('./src/routes/orderRoutes');

const app = express();

app.use(express.json());

app.use('/order', orderRoutes); // Todas as rotas de pedido começam com /order

// Rota raiz de verificação (health check)
app.get('/', (req, res) => {
  res.json({ message: 'API de Pedidos funcionando! 🚀', version: '1.0.0' });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;