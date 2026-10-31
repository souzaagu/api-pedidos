const express = require('express');
const pedidosRoutes = require('./routes/pedidosRoutes');

const app = express();

app.use(express.json());

app.use('/pedidos', pedidosRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ erro: 'JSON inválido.' });
  }
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

module.exports = app;