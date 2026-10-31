const pedidos = [];
let proximoId = 1;

const tiposPermitidos = ['entrega', 'retirada'];
const prioridadesPermitidas = ['baixa', 'normal', 'alta'];

function limpar() {
  pedidos.length = 0;
  proximoId = 1;
}

function validarDados(dados) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    return 'O corpo da requisição deve ser um objeto JSON.';
  }

  if (typeof dados.cliente !== 'string' || dados.cliente.trim() === '') {
    return 'O campo cliente é obrigatório.';
  }

  if (typeof dados.valor !== 'number' || Number.isNaN(dados.valor) || dados.valor <= 0) {
    return 'O campo valor deve ser um número maior que zero.';
  }

  if (!tiposPermitidos.includes(dados.tipo)) {
    return 'O campo tipo deve ser entrega ou retirada.';
  }

  if (!prioridadesPermitidas.includes(dados.prioridade)) {
    return 'O campo prioridade deve ser baixa, normal ou alta.';
  }

  return null;
}

function criar(dados) {
  const erro = validarDados(dados);
  if (erro) {
    return { erro };
  }

  const pedido = {
    id: proximoId++,
    cliente: dados.cliente.trim(),
    tipo: dados.tipo,
    valor: dados.valor,
    prioridade: dados.prioridade,
    status: 'recebido'
  };

  pedidos.push(pedido);
  return { pedido };
}

function listar() {
  return pedidos;
}

function buscarPorId(id) {
  return pedidos.find((pedido) => pedido.id === id) || null;
}

function atualizarStatus(id, novoStatus) {
  const pedido = buscarPorId(id);

  if (!pedido) {
    return null;
  }

  if (pedido.status === 'recebido') {
    if (novoStatus !== 'em_preparacao' && novoStatus !== 'cancelado') {
      return false;
    }
  } else if (pedido.status === 'em_preparacao') {
    if (novoStatus !== 'enviado' && novoStatus !== 'cancelado') {
      return false;
    }
  } else if (pedido.status === 'enviado') {
    if (novoStatus !== 'entregue') {
      return false;
    }
  } else {
    return false;
  }

  pedido.status = novoStatus;
  return pedido;
}

module.exports = { criar, listar, buscarPorId, atualizarStatus, limpar };