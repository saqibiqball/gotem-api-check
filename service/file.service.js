const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

class FileService {
	createDir(rootPath, dirName, userFolder = '') {
		let filePath;
		if (userFolder.length) {
			filePath = rootPath + '/' + userFolder + '/' + dirName;
		} else {
			filePath = rootPath + '/' + dirName;
		}

		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath);
		}
	}

	deleteDir(rootPath, dirName) {
		const filePath = rootPath + '/' + dirName;

		if (fs.existsSync(filePath)) {
			fs.rmdirSync(filePath, { recursive: true });
		}
	}

	saveFile(file, filePath, newFileName) {
		file.mv(filePath + '/' + newFileName);
	}

	deleteFile(rootPath, fileName) {
		const file = rootPath + '/' + fileName;
		if (fs.existsSync(file)) {
			try {
				fs.unlinkSync(file);
			} catch (e) {
				console.log(e);
			}
		}
	}

	static addFilesFromDirectoryToZip(coursePath, zip) {
		const directoryContents = fs.readdirSync(coursePath, {
			withFileTypes: true,
		});
		directoryContents.forEach(({ name }) => {
			const path = `${coursePath}/${name}`;
			if (fs.statSync(path).isFile()) {
				zip.file(name, fs.readFileSync(path));
			}
			if (fs.statSync(path).isDirectory()) {
				FileService.addFilesFromDirectoryToZip(path, zip);
			}
		});
	}

	async generateZipForPath(userLink = '', courseLink = '') {
		let coursePath = path.join('uploads', userLink, courseLink);
		if (fs.existsSync(coursePath)) {
			const zip = new JSZip();
			FileService.addFilesFromDirectoryToZip(coursePath, zip);
			return await zip.generateAsync({ type: 'base64' });
		}
	}
}

module.exports = new FileService();
