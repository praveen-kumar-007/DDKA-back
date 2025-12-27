const Institution = require('../models/Institution');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const registerInstitution = async (req, res) => {
    try {
        const { regNo, transactionId } = req.body;
        const file = req.file; // File from Multer

        if (!file) {
            return res.status(400).json({ success: false, message: "Payment screenshot is required." });
        }

        // Check for duplicates
        const existing = await Institution.findOne({ $or: [{ regNo }, { transactionId }] });
        if (existing) {
            if (file) fs.unlinkSync(file.path); // Delete local temp file
            return res.status(400).json({ success: false, message: "Reg No or Transaction ID already exists." });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'ddka_payments',
        });

        // Delete local temp file after upload
        fs.unlinkSync(file.path);

        // Save to Database
        const newInstitution = new Institution({
            ...req.body,
            screenshotUrl: result.secure_url
        });

        await newInstitution.save();
        res.status(201).json({ success: true, message: "Application submitted successfully!" });

    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getAllInstitutions = async (req, res) => {
    try {
        const institutions = await Institution.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: institutions });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching data" });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const inst = await Institution.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json({ success: true, data: inst });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
};

module.exports = { registerInstitution, getAllInstitutions, updateStatus };