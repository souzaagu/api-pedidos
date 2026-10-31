# API de Gerenciamento de Pedidos

API REST simples em Node.js e Express para gerenciar pedidos em memória.

## Instalação e Execução

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor:
```bash
npm start
```

3. Para rodar os testes:
```bash
npm test
```

## Arquitetura e Padrão

O projeto foi dividido em camadas simples:
- `src/routes`: definição das rotas da API.
- `src/controllers`: recebe as requisições e devolve as respostas HTTP.
- `src/services`: guarda os pedidos em memória e aplica as regras de validação e mudança de status.

## Regras e Valores Aceitos

- **cliente**: texto obrigatório e não pode ser vazio.
- **valor**: número maior que zero.
- **tipo**: `entrega` ou `retirada`.
- **prioridade**: `baixa`, `normal` ou `alta`.
- **status**: começa como `recebido`.
  - De `recebido` pode ir para `em_preparacao` ou `cancelado`.
  - De `em_preparacao` pode ir para `enviado` ou `cancelado`.
  - De `enviado` pode ir apenas para `entregue`.
  - `entregue` e `cancelado` são estados finais.

## Rotas

- `POST /pedidos`: cadastra um pedido (retorna 201 ou 400 se houver dados inválidos).
- `GET /pedidos`: lista todos os pedidos (retorna 200).
- `GET /pedidos/:id`: busca um pedido pelo ID (retorna 200 ou 404 se não existir).
- `PATCH /pedidos/:id/status`: atualiza o status do pedido (retorna 200, 400 para transição inválida ou 404 se não existir).

### Exemplo de criação (POST /pedidos)
```json
{
  "cliente": "Carlos Silva",
  "tipo": "entrega",
  "valor": 350,
  "prioridade": "normal"
}
```

### Exemplo de atualização de status (PATCH /pedidos/1/status)
```json
{
  "status": "cancelado"
}
```

## Uso de IA

Foi utilizado o auxílio de IA para revisar os requisitos do trabalho e ajustar as validações que faltavam no cadastro de pedidos.
- **Sugestão aceita**: adicionar a validação dos campos `tipo`, `valor` e `prioridade` no `pedidosService.js` e separar as rotas no arquivo `src/routes/pedidosRoutes.js`, pois o código inicial aceitava qualquer objeto sem validar os campos exigidos no enunciado.