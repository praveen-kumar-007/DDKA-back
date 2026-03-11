const express = require('express');
const router = express.Router();
const refereeController = require('../controllers/refereeController');

// Public routes
router.get('/', refereeController.getAllReferees);

module.exports = router;
