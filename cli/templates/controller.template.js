export default function controllerTemplate(data) {
	const name = data.charAt(0).toUpperCase() + data.slice(1);
	return `const ${data}Service = require('../service/${data}.service');
	
class ${name}Controller {
	async getAll(req, res, next) {
		try {
			const queryData = req.query;
			const ${data}s = await ${data}Service.getAll(queryData);
			return res.json({ message: ${data}s });
		} catch (e) {
			return next(e);
		}
	}

	async add(req, res, next) {
		try {
			const data = req.body;
			const user = req.user;
			const ${data} = await ${data}Service.add(data, user);
			return res.json({ message: ${data} });
		} catch (e) {
			return next(e);
		}
	}
	
	async getOne(req, res, next) {
		try {
			const user = req.user;
			const { id } = req.params;
			const ${data} = await ${data}Service.getOne(id);
			return res.json({ message: ${data} });
		} catch (e) {
			return next(e);
		}
	}
	
	async deleteOne(req, res, next) {
		try {
			const { id } = req.params;
			const user = req.user;
			const isDelete = await ${data}Service.deleteOne(id, user);
			return res.json({ message: isDelete });
		} catch (e) {
			return next(e);
		}
	}

	async update(req, res, next) {
		try {
			const data = req.body;
			const user = req.user;
			const ${data} = await ${data}Service.update(data, user);
			return res.json({ message: ${data} });
		} catch (e) {
			return next(e);
		}
	}
}

module.exports = new ${name}Controller();
`;
}
