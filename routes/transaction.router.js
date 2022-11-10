const Router = require('express');
const router = new Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.get('/', roleMiddleware(['admin']), transactionController.getAll);
router.get('/user', authMiddleware, transactionController.getForUser);
router.get('/freelancer', authMiddleware, transactionController.getForFreelancer);
router.post('/', authMiddleware, transactionController.addTransaction);

module.exports = router;
