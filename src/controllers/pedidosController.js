const pedidosService = require('../services/pedidosService');

function validarId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

function criar(req, res, next) {
  try {
    const resultado = pedidosService.criar(req.body);
    if (resultado.erro) {
      return res.status(400).json({ erro: resultado.erro });
    }
    return res.status(201).json(resultado.pedido);
  } catch (err) {
    next(err);
  }
}

function listar(req, res, next) {
  try {
    return res.status(200).json(pedidosService.listar());
  } catch (err) {
    next(err);
  }
}

function buscarPorId(req, res, next) {
  try {
    const id = validarId(req.params.id);
    if (id === null) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' });
    }

    const pedido = pedidosService.buscarPorId(id);
    if (!pedido) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' });
    }

    return res.status(200).json(pedido);
  } catch (err) {
    next(err);
  }
}

function atualizarStatus(req, res, next) {
  try {
    const id = validarId(req.params.id);
    if (id === null) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' });
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
  } catch (err) {
    next(err);
  }
}

module.exports = { criar, listar, buscarPorId, atualizarStatus };