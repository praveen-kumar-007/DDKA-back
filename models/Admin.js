const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } // In production, we use bcrypt to hash this
});

module.exports = mongoose.model('Admin', adminSchema);