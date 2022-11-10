const Router = require('express').Router;
const router = new Router();
const fs = require('fs');

fs.readdirSync(__dirname).forEach((file) => {
	if (file === 'index.js') return;
	const filePath = './' + file.replace('.js', '');
	const endPoint = '/' + file.replace('.js', '').split('.')[0];
	router.use(endPoint, require(filePath));
});

// const userRouter = require('./user.router');
// const reportRouter = require('./reports.router');
// const missionRouter = require('./missions.router');
// const paymentRouter = require('./payment.router');
// const disputeRouter = require('./disputes.router');
// const proposalRouter = require('./proposals.router');
// const evidenceRouter = require('./evidences.router');
// const milestoneRouter = require('./milestones.router');
// const transactionRouter = require('./transaction.router');
// const globalSettingsRouter = require('./settings.router');
// const chatRouter = require('./chat.router');
//
// router.use('/user', userRouter);
// router.use('/reports', reportRouter);
// router.use('/payment', paymentRouter);
// router.use('/disputes', disputeRouter);
// router.use('/missions', missionRouter);
// router.use('/evidences', evidenceRouter);
// router.use('/proposals', proposalRouter);
// router.use('/milestones', milestoneRouter);
// router.use('/transaction', transactionRouter);
// router.use('/settings', globalSettingsRouter);
// router.use('/chat', chatRouter);

module.exports = router;
