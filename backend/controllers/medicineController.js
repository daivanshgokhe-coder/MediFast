const Medicine = require("../models/Medicine");

// ========================================
// Get all medicines
// ========================================
async function getMedicines(req, res) {
    try {
        const medicines = await Medicine.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: medicines.length,
            medicines: medicines
        });

    } catch (error) {
        console.error("Get Medicines Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch medicines"
        });
    }
}

// ========================================
// Get medicine by ID
// ========================================
async function getMedicineById(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Medicine ID is required"
            });
        }

        const medicine =
            await Medicine.findById(id);

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            });
        }

        res.status(200).json({
            success: true,
            medicine: medicine
        });

    } catch (error) {
        console.error(
            "Get Medicine By ID Error:",
            error
        );

        res.status(400).json({
            success: false,
            message: "Invalid medicine ID"
        });
    }
}

// ========================================
// Delete medicine
// ========================================
async function deleteMedicine(req, res) {
    try {
        const medicine =
            await Medicine.findByIdAndDelete(
                req.params.id
            );

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            });
        }

        res.json({
            success: true,
            message: "Medicine deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete Medicine Error:",
            error
        );

        res.status(400).json({
            success: false,
            message: "Unable to delete medicine"
        });
    }
}

module.exports = {
    getMedicines,
    getMedicineById,
    deleteMedicine
};