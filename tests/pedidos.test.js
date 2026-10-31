const request = require('supertest');
const app = require('../src/app');
const pedidosService = require('../src/services/pedidosService');

describe('API de pedidos', () => {
  beforeEach(() => {
    pedidosService.limpar();
  });

  test('cria, mostra e muda o status do pedido', async () => {
    const criacao = await request(app)
      .post('/pedidos')
      .send({
        cliente: 'Carlos Silva',
        tipo: 'entrega',
        valor: 350,
        prioridade: 'normal'
      });

    expect(criacao.status).toBe(201);
    expect(criacao.body).toEqual({
      id: 1,
      cliente: 'Carlos Silva',
      tipo: 'entrega',
      valor: 350,
      prioridade: 'normal',
      status: 'recebido'
    });

    const listagem = await request(app).get('/pedidos');
    expect(listagem.status).toBe(200);
    expect(listagem.body).toHaveLength(1);

    const busca = await request(app).get('/pedidos/1');
    expect(busca.status).toBe(200);
    expect(busca.body.id).toBe(1);

    const pularEtapa = await request(app)
      .patch('/pedidos/1/status')
      .send({ status: 'enviado' });
    expect(pularEtapa.status).toBe(400);

    const semStatus = await request(app).patch('/pedidos/1/status');
    expect(semStatus.status).toBe(400);

    const preparando = await request(app)
      .patch('/pedidos/1/status')
      .send({ status: 'em_preparacao' });
    expect(preparando.status).toBe(200);

    const enviado = await request(app)
      .patch('/pedidos/1/status')
      .send({ status: 'enviado' });
    expect(enviado.body.status).toBe('enviado');

    const entregue = await request(app)
      .patch('/pedidos/1/status')
      .send({ status: 'entregue' });
    expect(entregue.body.status).toBe('entregue');

    const cancelamentoTardio = await request(app)
      .patch('/pedidos/1/status')
      .send({ status: 'cancelado' });
    expect(cancelamentoTardio.status).toBe(400);
  });

  test('permite cancelar antes do envio e mostra erro para pedido ausente ou invalido', async () => {
    const invalido = await request(app)
      .post('/pedidos')
      .send({
        cliente: '   ',
        tipo: 'entrega',
        valor: 0,
        prioridade: 'normal'
      });
    expect(invalido.status).toBe(400);

    const criacao = await request(app)
      .post('/pedidos')
      .send({
        cliente: 'Bia',
        tipo: 'retirada',
        valor: 120,
        prioridade: 'alta'
      });
    expect(criacao.status).toBe(201);
    expect(criacao.body.id).toBe(1);

    const cancelamento = await request(app)
      .patch('/pedidos/1/status')
      .send({ status: 'cancelado' });
    expect(cancelamento.status).toBe(200);
    expect(cancelamento.body.status).toBe('cancelado');

    const ausente = await request(app).get('/pedidos/999');
    expect(ausente.status).toBe(404);
  });
});