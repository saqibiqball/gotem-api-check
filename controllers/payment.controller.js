const paymentService = require('../service/payment.service');

class PaymentController {
	async paymentIntent(req, res, next) {
		try {
			const data = req.body;
			const user = req.user;
			const result = await paymentService.paymentIntent(data, user);
			return res.json({ message: result });
		} catch (e) {
			return next(e);
		}
	}

	async webhookListen(req, res, next) {
		try {
			const signature = req.headers['stripe-signature'];
			const body = req.body;
			await paymentService.webhookListen(body, signature);
			return res.json({ message: 'ok' });
		} catch (e) {
			return next(e);
		}
	}
}

module.exports = new PaymentController();
