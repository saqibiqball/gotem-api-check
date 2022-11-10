export default function routerTemplate(data) {
	return `const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/auth.middleware');
const ${data}Controller = require('../controllers/${data}.controller');

router.get('/', authMiddleware, ${data}Controller.getAll);
router.post('/', authMiddleware, ${data}Controller.add);
router.get('/:id', authMiddleware, ${data}Controller.getOne);
router.delete('/:id', authMiddleware, ${data}Controller.deleteOne);
router.put('/:id', authMiddleware, ${data}Controller.update);

module.exports = router;
`;
}
