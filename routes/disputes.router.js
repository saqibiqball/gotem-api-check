const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/auth.middleware');
const disputeController = require('../controllers/dispute.controller');

router.get('/', authMiddleware, disputeController.getDisputes);
router.post('/', authMiddleware, disputeController.addDispute);
router.put('/', authMiddleware, disputeController.updateDispute);

module.exports = router;
