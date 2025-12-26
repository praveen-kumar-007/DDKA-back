const express = require('express');
const router = express.Router();
// Destructure the functions from the controller
const { registerInstitution, getAllInstitutions, updateStatus } = require('../controllers/instController');

router.post('/register', registerInstitution);
router.get('/all', getAllInstitutions);
router.put('/:id', updateStatus);

module.exports = router;