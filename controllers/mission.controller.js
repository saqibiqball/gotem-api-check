const missionService = require('../service/mission.service');

class MissionController {
	async getAllPropertiesOfMission(req, res, next) {
		try {
			const missionProperties = await missionService.getAllPropertiesOfMission();
			return res.json({ message: missionProperties });
		} catch (e) {
			return next(e);
		}
	}

	async addMission(req, res, next) {
		try {
			const missionData = req.body;
			const filePath = req.filePath;
			const files = req.files || {};
			const userId = req.user.id;
			const newMission = await missionService.addMission(
				missionData,
				files,
				filePath,
				userId
			);
			return res.json({ message: newMission });
		} catch (e) {
			return next(e);
		}
	}

	async updateMission(req, res, next) {
		try {
			const missionData = req.body;
			const filePath = req.filePath;
			const files = req.files || {};
			const user = req.user;
			const newMission = await missionService.updateMission(
				missionData,
				files,
				filePath,
				user
			);
			return res.json({ message: newMission });
		} catch (e) {
			return next(e);
		}
	}

	async getOneMission(req, res, next) {
		try {
			const missionId = req.params.id;
			const user = req.user;
			const mission = await missionService.getOneMission(missionId, user, false);
			return res.json({ message: mission });
		} catch (e) {
			return next(e);
		}
	}

	async getPublicMissionInfo(req, res, next) {
		try {
			const missionId = req.params.id;
			const mission = await missionService.getOneMission(missionId);
			return res.json({ message: mission });
		} catch (e) {
			return next(e);
		}
	}

	async getAllMissions(req, res, next) {
		try {
			const queryParams = req.query;
			const { rows, count } = await missionService.getAllMissions(queryParams);
			return res.json({ message: { rows, count } });
		} catch (e) {
			return next(e);
		}
	}

	async getAllMissionsWithOutQuery(req, res, next) {
		try {
			const missions = await missionService.getAllMissionsWithOutQuery();
			return res.json({ message: missions });
		} catch (e) {
			return next(e);
		}
	}

	async deleteMission(req, res, next) {
		try {
			const { id } = req.params;
			const user = req.user;
			const isDeleted = await missionService.deleteMission(id, user);
			return res.json({ message: isDeleted });
		} catch (e) {
			return next(e);
		}
	}

	async addToFavorites(req, res, next) {
		try {
			const userId = req.user.id;
			const missionIs = req.query.id;
			const missionBookmarks = await missionService.addToFavorites(userId, missionIs);
			return res.json({ message: missionBookmarks });
		} catch (e) {
			return next(e);
		}
	}

	async checkHasProposal(req, res, next) {
		try {
			const user = req.user;
			const missionId = req.query.id;
			const result = await missionService.checkHasProposal(missionId, user);
			return res.json({ message: result });
		} catch (e) {
			return next(e);
		}
	}
}

module.exports = new MissionController();
