const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/auth.middleware');
const missionController = require('../controllers/mission.controller');

router.get('/get-all-properties', authMiddleware, missionController.getAllPropertiesOfMission);
router.post('/add-mission', authMiddleware, missionController.addMission);
router.put('/update-mission', authMiddleware, missionController.updateMission);
router.get('/get-all-missions', missionController.getAllMissions);
router.get('/get-all-missions-without-query', missionController.getAllMissionsWithOutQuery);
router.get('/add-to-favorites', authMiddleware, missionController.addToFavorites);
router.get('/check-has-proposal', authMiddleware, missionController.checkHasProposal);
router.get('/get-mission/:id', authMiddleware, missionController.getOneMission);
router.get('/get-mission-info/:id', missionController.getPublicMissionInfo);
router.delete('/delete-mission/:id', authMiddleware, missionController.deleteMission);

module.exports = router;
