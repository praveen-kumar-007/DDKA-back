const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const TechnicalOfficial = require("../models/TechnicalOfficial");
const Admin = require("../models/Admin");
const {
  protect,
  admin,
  isSuperAdmin,
  requirePermission,
} = require("../middleware/authMiddleware");

// Temporary disk storage for uploads (Cloudinary will store permanently)
const upload = multer({ dest: "uploads/" });

const {
  registerTechnicalOfficial,
  getAllTechnicalOfficials,
  getTechnicalOfficialById,
  updateTechnicalOfficialStatus,
  updateTechnicalOfficial,
  deleteTechnicalOfficial,
  downloadOwnOfficialAsset,
  downloadOfficialAssetById,
} = require("../controllers/technicalOfficialController");

const protectOfficial = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== "official" || !decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized as official" });
    }

    const official = await TechnicalOfficial.findById(decoded.id).select("_id");
    if (!official) {
      return res
        .status(401)
        .json({ success: false, message: "Official not found" });
    }

    req.user = { id: String(official._id), role: "official" };
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

const protectOfficialOrAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id || !decoded.role) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token invalid" });
    }

    if (decoded.role === "official") {
      const official = await TechnicalOfficial.findById(decoded.id).select(
        "_id",
      );
      if (!official) {
        return res
          .status(401)
          .json({ success: false, message: "Official not found" });
      }
      req.user = { id: String(official._id), role: "official" };
      return next();
    }

    const adminDoc = await Admin.findById(decoded.id).select("-password");
    if (adminDoc) {
      req.admin = adminDoc;
      req.adminRole = adminDoc.role;
      req.adminPermissions = adminDoc.permissions || {};
      return next();
    }

    return res.status(401).json({ success: false, message: "Not authorized" });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

// Public registration route
router.post(
  "/register",
  upload.fields([
    { name: "signature", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "receipt", maxCount: 1 },
  ]),
  registerTechnicalOfficial,
);

// Official self-download routes
router.get(
  "/me/:assetType/download",
  protectOfficial,
  downloadOwnOfficialAsset,
);
router.get(
  "/me/download/:assetType",
  protectOfficial,
  downloadOwnOfficialAsset,
);

// Admin download routes by official ID
router.get(
  "/:id/:assetType/download",
  protectOfficialOrAdmin,
  downloadOfficialAssetById,
);
router.get(
  "/:id/download/:assetType",
  protectOfficialOrAdmin,
  downloadOfficialAssetById,
);

// Admin routes (protected, Technical Officials tab)
router.get(
  "/",
  protect,
  admin,
  requirePermission("canAccessTechnicalOfficials"),
  getAllTechnicalOfficials,
);
router.get(
  "/:id",
  protect,
  admin,
  requirePermission("canAccessTechnicalOfficials"),
  getTechnicalOfficialById,
);
router.put(
  "/status",
  protect,
  admin,
  requirePermission("canAccessTechnicalOfficials"),
  updateTechnicalOfficialStatus,
);
router.put(
  "/:id",
  protect,
  admin,
  requirePermission("canAccessTechnicalOfficials"),
  upload.fields([
    { name: "signature", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "receipt", maxCount: 1 },
  ]),
  updateTechnicalOfficial,
);
router.delete(
  "/:id",
  protect,
  requirePermission("canDelete"),
  deleteTechnicalOfficial,
);

module.exports = router;
