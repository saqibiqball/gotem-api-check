const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/auth.middleware');
const proposalController = require('../controllers/proposal.controller');

router.get('/properties', authMiddleware, proposalController.getAllProperties);
router.post('/add', authMiddleware, proposalController.add);
router.put('/update', authMiddleware, proposalController.update);
router.get('/all', authMiddleware, proposalController.getAll);
router.get('/download-zip', proposalController.downloadZip);
router.get('/one/:id', authMiddleware, proposalController.getOne);
router.get('/one-active/:id', authMiddleware, proposalController.getOneActive);
router.get('/one-info/:id', proposalController.getOnePublic);
router.delete('/delete/:id', authMiddleware, proposalController.delete);

module.exports = router;
