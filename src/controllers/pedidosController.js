const pedidosService = require('../services/pedidosService');

function validarId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

function criar(req, res) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ erro: 'O corpo da requisição deve ser um objeto JSON.' });
  }

  const pedido = pedidosService.criar(req.body);
  return res.status(201).json(pedido);
}

function listar(req, res) {
  return res.status(200).json(pedidosService.listar());
}

function buscarPorId(req, res) {
  const id = validarId(req.params.id);
  if (id === null) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  const pedido = pedidosService.buscarPorId(id);
  if (!pedido) {
    return res.status(404).json({ erro: 'Pedido não encontrado.' });
  }

  return res.status(200).json(pedido);
}

function atualizarStatus(req, res) {
  const id = validarId(req.params.id);
  if (id === null) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  const status = req.body ? req.body.status : null;
  const pedido = pedidosService.atualizarStatus(id, status);
  if (pedido === null) {
    return res.status(404).json({ erro: 'Pedido não encontrado.' });
  }

  if (pedido === false) {
    return res.status(400).json({ erro: 'Essa mudança de status não é permitida.' });
  }

  return res.status(200).json(pedido);
}

module.exports = { criar, listar, buscarPorId, atualizarStatus };