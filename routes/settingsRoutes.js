const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { getPublicSettings, getSettings, updateSettings, updateHeroSettings, updateMiniTournamentSettings } = require('../controllers/settingsController');
const { protect, admin, isSuperAdmin } = require('../middleware/authMiddleware');

// Public settings for front-end
router.get('/public', getPublicSettings);

// Admin-only settings routes
router.get('/', protect, isSuperAdmin, getSettings);
router.patch('/', protect, isSuperAdmin, updateSettings);
router.patch('/hero', protect, admin, isSuperAdmin, upload.fields([
	{ name: 'heroImage', maxCount: 1 },
	{ name: 'heroVideo', maxCount: 1 },
]), updateHeroSettings);
router.patch('/home-mini-tournament', protect, admin, isSuperAdmin, upload.fields([
	{ name: 'miniTournamentImage', maxCount: 1 },
	{ name: 'miniTournamentVideo', maxCount: 1 },
]), updateMiniTournamentSettings);

module.exports = router;