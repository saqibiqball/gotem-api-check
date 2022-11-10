const fileService = require('./file.service');
const uuid = require('uuid');
const sequelize = require('../database');
const ApiError = require('../exceptions/ApiError');
const { Evidences, EvidencesFiles } = require('../database').models;

class EvidenceService {
	async uploadFiles(evidence, files, filePath, transaction = {}) {
		for (let key of Object.keys(files)) {
			const filesArray = [];

			if (!Array.isArray(files[key])) {
				files[key] = [files[key]];
			}

			if (files[key].length > 0) {
				files[key].forEach((file) => {
					filesArray.push({
						name: 'evidences/' + evidence.activationLink + '/' + file.name,
						evidenceId: evidence.id,
					});
					fileService.saveFile(
						file,
						filePath + '/evidences/' + evidence.activationLink,
						file.name
					);
				});
			}

			switch (key) {
				case 'uploaded_evidenceFiles':
					await EvidencesFiles.bulkCreate(filesArray, transaction);
					break;
			}
		}
	}

	async deleteFiles(data, filePath, transaction = {}) {
		const deletedObj = JSON.parse(data);
		for (let key of Object.keys(deletedObj)) {
			let files = [];
			switch (key) {
				case 'evidenceFiles':
					files = await EvidencesFiles.findAll({
						where: { id: deletedObj[key] },
						...transaction,
					});
					await EvidencesFiles.destroy({
						where: { id: files.map((i) => i.id) },
						...transaction,
					});
					break;
			}
			files.forEach((file) => {
				fileService.deleteFile(filePath, file.name);
			});
		}
	}

	async create(data, files, user, filePath) {
		return await sequelize.transaction(async (t) => {
			const activationLink = uuid.v4();
			const objToCreateEvidence = {};
			objToCreateEvidence.activationLink = activationLink;

			Object.keys(data).forEach((key) => {
				data[key] !== 'null'
					? (objToCreateEvidence[key] = data[key])
					: (objToCreateEvidence[key] = null);
			});
			const newEvidence = await Evidences.create(objToCreateEvidence, { transaction: t });

			fileService.createDir(filePath, 'evidences');
			fileService.createDir(filePath, 'evidences/' + activationLink);

			if (Object.keys(files).length > 0) {
				await this.uploadFiles(newEvidence, files, filePath, { transaction: t });
			}
			return newEvidence;
		});
	}

	async update(data, files, user, filePath) {
		return await sequelize.transaction(async (t) => {
			let deleteFiles = '';
			const evidence = await Evidences.findByPk(data.id, { transaction: t });

			for (let key of Object.keys(data)) {
				if (key in evidence) {
					evidence[key] = data[key] !== 'null' ? data[key] : null;
				}
			}

			await evidence.save({ transaction: t });

			if ('toDelete' in data) {
				deleteFiles = data.toDelete;
			}

			if (Object.keys(files).length > 0) {
				await this.uploadFiles(evidence, files, filePath, { transaction: t });
			}

			if (deleteFiles.length > 0) {
				await this.deleteFiles(deleteFiles, filePath, { transaction: t });
			}

			return evidence;
		});
	}
}

module.exports = new EvidenceService();
