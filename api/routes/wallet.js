const express = require('express');
const router = express.Router();
const auth = require('../../shared/authMiddleware');
const controller = require('../controllers/walletController');

router.post('/add', auth, controller.addMoney);
router.post('/withdraw', auth, controller.withdrawMoney);
router.get('/balance', auth, controller.getBalance);

module.exports = router;


