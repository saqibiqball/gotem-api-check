const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/auth.middleware');
const evidenceController = require('../controllers/evidence.controller');
const roleMiddleware = require('../middleware/role.middleware');

router.post('/', authMiddleware, roleMiddleware(['source']), evidenceController.create);
router.put('/', authMiddleware, roleMiddleware(['source']), evidenceController.update);

module.exports = router;
