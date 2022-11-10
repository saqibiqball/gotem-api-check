export default function serviceTemplate(data) {
	const name = data.charAt(0).toUpperCase() + data.slice(1);
	return `class ${name}Service {
	async getAll(queryData) {

	}

	async add(data, user) {

	}
	
	async getOne(id) {

	}
	
	async deleteOne(id) {

	}

	async update(data, user) {

	}
}

module.exports = new ${name}Service();
`;
}
