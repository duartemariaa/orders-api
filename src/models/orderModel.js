const db = require('../config/database');

/**
 * Cria um novo pedido no banco de dados.
 * Usa uma transação para garantir que o pedido E os itens sejam salvos juntos,
 * ou nenhum dos dois (atomicidade).
 * @param {Object} order - Objeto com os dados mapeados do pedido
 */
function createOrder(order) {
  const transaction = db.transaction(() => {
    const insertOrder = db.prepare(`
      INSERT INTO "Order" (orderId, value, creationDate)
      VALUES (@orderId, @value, @creationDate)
    `);
    insertOrder.run({
      orderId: order.orderId,
      value: order.value,
      creationDate: order.creationDate,
    });

    const insertItem = db.prepare(`
      INSERT INTO Items (orderId, productId, quantity, price)
      VALUES (@orderId, @productId, @quantity, @price)
    `);
    for (const item of order.items) {
      insertItem.run({
        orderId: order.orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }
  });

  transaction();
}

/**
 * Busca um pedido pelo ID (orderId), incluindo seus itens.
 * @param {string} orderId - ID do pedido
 * @returns {Object|null} - Pedido com itens, ou null se não encontrado
 */
function getOrderById(orderId) {
  const order = db.prepare(`
    SELECT * FROM "Order" WHERE orderId = ?
  `).get(orderId);

  if (!order) return null;

  const items = db.prepare(`
    SELECT productId, quantity, price FROM Items WHERE orderId = ?
  `).all(orderId);

  return { ...order, items };
}

/**
 * Lista todos os pedidos com seus respectivos itens.
 * @returns {Array} - Lista de pedidos com itens
 */
function getAllOrders() {
  const orders = db.prepare(`SELECT * FROM "Order"`).all();

  return orders.map((order) => {
    const items = db.prepare(`
      SELECT productId, quantity, price FROM Items WHERE orderId = ?
    `).all(order.orderId);
    return { ...order, items };
  });
}

/**
 * Atualiza os dados de um pedido existente.
 * Usa transação para garantir consistência: atualiza o pedido e substitui os itens.
 * @param {string} orderId - ID do pedido a ser atualizado
 * @param {Object} updatedData - Novos dados mapeados
 */
function updateOrder(orderId, updatedData) {
  const transaction = db.transaction(() => {
    const updateOrderStmt = db.prepare(`
      UPDATE "Order"
      SET value = @value, creationDate = @creationDate
      WHERE orderId = @orderId
    `);
    const result = updateOrderStmt.run({
      orderId,
      value: updatedData.value,
      creationDate: updatedData.creationDate,
    });

    if (result.changes === 0) throw new Error('ORDER_NOT_FOUND');

    db.prepare(`DELETE FROM Items WHERE orderId = ?`).run(orderId);

    const insertItem = db.prepare(`
      INSERT INTO Items (orderId, productId, quantity, price)
      VALUES (@orderId, @productId, @quantity, @price)
    `);
    for (const item of updatedData.items) {
      insertItem.run({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }
  });

  transaction();
}

/**
 * Deleta um pedido e seus itens pelo ID.
 * Por causa do ON DELETE CASCADE no banco, os itens são deletados automaticamente.
 * @param {string} orderId - ID do pedido a ser deletado
 * @returns {boolean} - true se deletou, false se não encontrou
 */
function deleteOrder(orderId) {
  const result = db.prepare(`
    DELETE FROM "Order" WHERE orderId = ?
  `).run(orderId);

  return result.changes > 0; // true se alguma linha foi deletada
}

module.exports = { createOrder, getOrderById, getAllOrders, updateOrder, deleteOrder };