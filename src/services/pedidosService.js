const pedidos = [];
let proximoId = 1;

function criar(dados) {
  const pedido = {
    ...dados,
    id: proximoId++,
    status: 'recebido',
    criadoEm: new Date().toISOString(),
  };

  pedidos.push(pedido);
  return pedido;
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

module.exports = { criar, listar, buscarPorId, atualizarStatus };