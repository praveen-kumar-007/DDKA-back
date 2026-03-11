const express = require('express');
const router = express.Router();
const refereeController = require('../controllers/refereeController');
const { protect, admin, isSuperAdmin, requirePermission } = require('../middleware/authMiddleware');

// Admin routes for referee management
router.get('/', protect, admin, requirePermission('canAccessReferees'), refereeController.getAdminReferees);
router.post('/legacy', protect, admin, requirePermission('canAccessReferees'), refereeController.createLegacyRefereeEntry);
router.patch('/:id/visibility', protect, admin, isSuperAdmin, refereeController.updateRefereeVisibility);
router.patch('/:id/post', protect, admin, requirePermission('canAccessReferees'), refereeController.updateRefereePost);
router.patch('/:id/legacy', protect, admin, requirePermission('canAccessReferees'), refereeController.updateLegacyRefereeEntry);
router.delete('/:id', protect, admin, requirePermission('canDelete'), refereeController.deleteLegacyReferee);

module.exports = router;
