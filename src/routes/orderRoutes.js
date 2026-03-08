const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/list', orderController.listOrders);   // GET  /order/list

router.post('/', orderController.createOrder);     // POST   /order
router.get('/:orderId', orderController.getOrder); // GET    /order/:orderId
router.put('/:orderId', orderController.updateOrder);    // PUT    /order/:orderId
router.delete('/:orderId', orderController.deleteOrder); // DELETE /order/:orderId

module.exports = router;