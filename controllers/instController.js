const Institution = require('../models/Institution');

// 1. Register a new institution
const registerInstitution = async (req, res) => {
    try {
        const { regNo, transactionId } = req.body;

        // Check if Registration Number exists
        const checkReg = await Institution.findOne({ regNo });
        if (checkReg) {
            return res.status(400).json({ success: false, message: "This Registration Number is already registered." });
        }

        // Check if Transaction ID was already used
        const checkTxn = await Institution.findOne({ transactionId });
        if (checkTxn) {
            return res.status(400).json({ success: false, message: "This Transaction ID has already been submitted." });
        }

        const newInstitution = new Institution(req.body);
        await newInstitution.save();

        res.status(201).json({ 
            success: true, 
            message: "Institution application submitted successfully!" 
        });

    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// 2. Get all institutions (For Admin)
const getAllInstitutions = async (req, res) => {
    try {
        const institutions = await Institution.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: institutions });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching data" });
    }
};

// 3. Update Status
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const inst = await Institution.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json({ success: true, data: inst });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
};

// EXPORT ALL THREE FUNCTIONS
module.exports = { registerInstitution, getAllInstitutions, updateStatus };