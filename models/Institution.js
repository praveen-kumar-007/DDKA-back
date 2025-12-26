const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
    // Section 1: Profile
    instType: { type: String, required: true, enum: ['School', 'Club', 'College', 'Academy'] },
    instName: { type: String, required: true },
    regNo: { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    
    // Section 2: Leadership
    headName: { type: String, required: true },
    secretaryName: { type: String, required: true },
    
    // Section 3: Infrastructure
    totalPlayers: { type: Number, required: true },
    area: { type: String, required: true },
    surfaceType: { type: String, required: true },
    
    // Section 4: Contact
    officePhone: { type: String, required: true },
    altPhone: { type: String },
    email: { type: String, required: true },
    address: { type: String, required: true },
    
    // Payment Tracking
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Verified', 'Rejected'] }
}, { timestamps: true });

module.exports = mongoose.model('Institution', institutionSchema);