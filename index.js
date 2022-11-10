const express = require('express');
const os = require('os');
const cluster = require('cluster');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const sequelize = require('./database');
const router = require('./routes');
const errorHandler = require('./middleware/logErrors.middleware');
const logErrors = require('./middleware/errorHandling.middleware');
const filePathMiddleware = require('./middleware/filePath.middleware');
const logger = require('./utils/logger');
const deleteAlmostAllGroupMessages = require('./scheduls/messages.schedule');

const pid = process.pid;
const { PORT } = process.env || 3010;

const server = express();
server.use(helmet());
server.use(cors());
server.use(compression());
server.use(fileUpload({}));
server.use(filePathMiddleware(path.resolve(__dirname, 'uploads')));
server.use('/api/payment/webhook', express.raw({ type: '*/*' }));
server.use(express.json());

if (process.env.NODE_ENV === 'development') {
	server.use(
		morgan(':method :url :status :res[content-length] - :response-time ms', {
			stream: logger.stream,
		})
	);
}

server.use('/api', router);
server.use('/', express.static(path.resolve(__dirname, 'uploads')));

server.use(logErrors);
server.use(errorHandler);

const connectionToDB = async () => {
	logger.info(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		logger.info('Database connection OK!');
		if (process.env.NODE_ENV !== 'production') {
			// forcefully sync and alter the whole database use in case of relations issue
			// await sequelize.sync({ force: false, alter: true });
			// await sequelize.sync();
			// logger.info('Database Sync OK!');
		}
	} catch (error) {
		logger.error('Unable to connect to the database:' + '\n' + error.message);
		process.exit(1);
	}
};

const clustersWorker = (enable = true) => {
	if (enable) {
		if (cluster.isMaster) {
			let cpus = os.cpus().length;
			logger.info(`Master started. Pid: ${pid}!`);
			for (let i = 0; i < cpus - 1; i++) {
				cluster.fork();
			}
			cluster.on('exit', (worker) => {
				logger.info(`Worker ${worker.process.pid} died.`);
				cluster.fork();
			});
		} else {
			server.listen(PORT, () => logger.info(`Worker ${cluster.worker.id} launched ${pid}`));
		}
	} else {
		server.listen(PORT, () => {
			logger.info(`Server started on port http://localhost:${PORT} !!! Happy Hacking :)`);
		});
	}
};

const start = async () => {
	try {
		deleteAlmostAllGroupMessages();
		await connectionToDB();
		clustersWorker(process.env.NODE_ENV === 'production'); //set false to func arguments for disable clusters
	} catch (e) {
		logger.error(e);
	}
};

start();
