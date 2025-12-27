const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerInstitution, getAllInstitutions, updateStatus } = require('../controllers/instController');

// Temp storage for files before Cloudinary upload
const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.single('screenshot'), registerInstitution);
router.get('/all', getAllInstitutions);
router.put('/:id', updateStatus);

module.exports = router;