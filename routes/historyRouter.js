const router = require('express').Router();
const historyController = require('../controllers/historyController');

router.get('/', historyController.getHistory)

module.exports = router