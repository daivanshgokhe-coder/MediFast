const express = require("express");

const router = express.Router();

const {
    getMedicines,
    getMedicineById,
    deleteMedicine
} = require("../controllers/medicineController");

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");

// ========================================
// GET all medicines
// GET /api/medicines
// ========================================
router.get(
    "/",
    getMedicines
);

// ========================================
// GET single medicine
// GET /api/medicines/:id
// ========================================
router.get(
    "/:id",
    getMedicineById
);

// ========================================
// DELETE medicine
// DELETE /api/medicines/:id
// Admin only
// ========================================
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteMedicine
);

module.exports = router;