const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
    instType: { type: String, required: true, enum: ['School', 'Club', 'College', 'Academy'] },
    instName: { type: String, required: true },
    regNo: { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    headName: { type: String, required: true },
    secretaryName: { type: String, required: true },
    totalPlayers: { type: Number, required: true },
    area: { type: String, required: true },
    surfaceType: { type: String, required: true },
    officePhone: { type: String, required: true },
    altPhone: { type: String },
    email: { type: String, required: true },
    address: { type: String, required: true },
    acceptedTerms: { type: Boolean, required: true, default: false },
    transactionId: { type: String, required: true, unique: true },
    // New Field for Cloudinary URL
    screenshotUrl: { type: String, required: true }, 
    status: { type: String, default: 'Pending', enum: ['Pending', 'Verified', 'Rejected'] }
}, { timestamps: true });

module.exports = mongoose.model('Institution', institutionSchema);