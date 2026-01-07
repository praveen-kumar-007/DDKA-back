const express = require('express');
const { signup, login, checkAdminExists, listAdmins, updateAdmin, getCurrentAdmin } = require('../controllers/adminController');
const { protect, admin, isSuperAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/exists', checkAdminExists);

// Current admin profile (any logged-in admin)
router.get('/me', protect, admin, getCurrentAdmin);

// Superadmin-only routes
router.get('/', protect, isSuperAdmin, listAdmins);
router.patch('/:id', protect, isSuperAdmin, updateAdmin);

module.exports = router;
