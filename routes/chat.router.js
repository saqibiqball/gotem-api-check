const Router = require('express');
const router = new Router();
const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, chatController.addPrivateChat);
router.get('/', authMiddleware, chatController.getAllChatsPrivate);
router.put('/reade-messages', authMiddleware, chatController.changeMessagesToRead);
router.get('/count-unread-messages', authMiddleware, chatController.getUnreadMessagesCount);
router.get(
	'/count-unread-messages-for-each-chat',
	authMiddleware,
	chatController.getUnreadMessagesForEachChatCount
);
router.get('/group', authMiddleware, chatController.getAllMessagesOfGroupChat);
router.post('/group', authMiddleware, chatController.addMessageToGroupChat);
router.delete('/group', authMiddleware, chatController.deleteAlmostAllGroupMessages);
router.get('/:id', authMiddleware, chatController.getAllMessagesOfPrivateChat);

module.exports = router;
