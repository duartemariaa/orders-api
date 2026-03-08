const orderModel = require('../models/orderModel');

/**
 * Faz o mapeamento (mapping) dos dados recebidos no body da requisição
 * para o formato que será salvo no banco de dados.
 *
 * Entrada (body da requisição):
 *   numeroPedido, valorTotal, dataCriacao, items[{idItem, quantidadeItem, valorItem}]
 *
 * Saída (formato do banco):
 *   orderId, value, creationDate, items[{productId, quantity, price}]
 *
 * @param {Object} body - Dados brutos da requisição
 * @returns {Object} - Dados mapeados para o banco
 */
function mapRequestToOrder(body) {
  return {
    orderId: body.numeroPedido,             // numeroPedido → orderId
    value: body.valorTotal,                 // valorTotal   → value
    creationDate: new Date(body.dataCriacao).toISOString(), // dataCriacao  → creationDate (normaliza o formato)
    items: (body.items || []).map((item) => ({
      productId: parseInt(item.idItem, 10), // idItem        → productId (string → número inteiro)
      quantity: item.quantidadeItem,        // quantidadeItem→ quantity
      price: item.valorItem,                // valorItem     → price
    })),
  };
}

/**
 * Valida se os campos obrigatórios estão presentes no body.
 * @param {Object} body
 * @returns {string|null} - Mensagem de erro ou null se válido
 */
function validateBody(body) {
  if (!body.numeroPedido) return 'O campo "numeroPedido" é obrigatório.';
  if (body.valorTotal === undefined || body.valorTotal === null) return 'O campo "valorTotal" é obrigatório.';
  if (!body.dataCriacao) return 'O campo "dataCriacao" é obrigatório.';
  if (!Array.isArray(body.items) || body.items.length === 0) return 'O campo "items" deve ser um array não vazio.';
  for (const [i, item] of body.items.entries()) {
    if (!item.idItem) return `Item[${i}]: o campo "idItem" é obrigatório.`;
    if (item.quantidadeItem === undefined) return `Item[${i}]: o campo "quantidadeItem" é obrigatório.`;
    if (item.valorItem === undefined) return `Item[${i}]: o campo "valorItem" é obrigatório.`;
  }
  return null;
}

/**
 * POST /order
 * Cria um novo pedido no banco de dados.
 */
async function createOrder(req, res) {
  try {
    const validationError = validateBody(req.body);
    if (validationError) { 
      return res.status(400).json({ error: validationError });
    }

    const mappedOrder = mapRequestToOrder(req.body);
    orderModel.createOrder(mappedOrder);

    return res.status(201).json({
      message: 'Pedido criado com sucesso!',
      order: mappedOrder,
    });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Já existe um pedido com esse número.' });
    }
    console.error('Erro ao criar pedido:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

/**
 * GET /order/:orderId
 * Retorna os dados de um pedido específico pelo ID.
 */
async function getOrder(req, res) {
  try {
    const { orderId } = req.params;
    const order = orderModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: `Pedido "${orderId}" não encontrado.` });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.error('Erro ao buscar pedido:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

/**
 * GET /order/list
 * Lista todos os pedidos.
 */
async function listOrders(req, res) {
  try {
    const orders = orderModel.getAllOrders();
    return res.status(200).json({ total: orders.length, orders });
  } catch (err) {
    console.error('Erro ao listar pedidos:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

/**
 * PUT /order/:orderId
 * Atualiza um pedido existente.
 */
async function updateOrder(req, res) {
  try {
    const { orderId } = req.params;

    const validationError = validateBody(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const mappedOrder = mapRequestToOrder(req.body);
    orderModel.updateOrder(orderId, mappedOrder);

    return res.status(200).json({
      message: 'Pedido atualizado com sucesso!',
      order: { orderId, ...mappedOrder },
    });
  } catch (err) {
    if (err.message === 'ORDER_NOT_FOUND') {
      return res.status(404).json({ error: `Pedido "${req.params.orderId}" não encontrado.` });
    }
    console.error('Erro ao atualizar pedido:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

/**
 * DELETE /order/:orderId
 * Remove um pedido pelo ID.
 */
async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;
    const deleted = orderModel.deleteOrder(orderId);

    if (!deleted) {
      return res.status(404).json({ error: `Pedido "${orderId}" não encontrado.` });
    }

    return res.status(200).json({ message: `Pedido "${orderId}" deletado com sucesso.` });
  } catch (err) {
    console.error('Erro ao deletar pedido:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

module.exports = { createOrder, getOrder, listOrders, updateOrder, deleteOrder };