const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/auth.middleware');
const paymentController = require('../controllers/payment.controller');

router.post('/create-payment-intent', authMiddleware, paymentController.paymentIntent);
router.post('/webhook', paymentController.webhookListen);

module.exports = router;
