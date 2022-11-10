const Router = require('express');
const router = new Router();
const roleMiddleware = require('../middleware/role.middleware');
const globalSettingController = require('../controllers/globalSetting.controller');

router.get('/', roleMiddleware(['admin']), globalSettingController.getDisputeEmail);
router.put('/', roleMiddleware(['admin']), globalSettingController.changeDisputeEmail);

module.exports = router;
