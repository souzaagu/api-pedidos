const express = require('express');
const pedidosController = require('./controllers/pedidosController');

const app = express();

app.use(express.json());

app.post('/pedidos', pedidosController.criar);
app.get('/pedidos', pedidosController.listar);
app.get('/pedidos/:id', pedidosController.buscarPorId);
app.patch('/pedidos/:id/status', pedidosController.atualizarStatus);

app.use((req, res) => {
	res.status(404).json({ erro: 'Rota não encontrada.' });
});

module.exports = app;
