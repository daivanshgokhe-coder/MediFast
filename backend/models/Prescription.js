const mongoose = require("mongoose");

const prescriptionSchema =
    new mongoose.Schema(
        {

            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            doctorName: {
                type: String,
                required: true,
                trim: true
            },

            fileName: {
                type: String,
                required: true
            },

            filePath: {
                type: String,
                required: true
            },

            notes: {
                type: String,
                default: ""
            },

            status: {
                type: String,
                enum: [
                    "Submitted",
                    "Under Review",
                    "Approved",
                    "Rejected"
                ],
                default: "Submitted"
            }

        },

        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "Prescription",
        prescriptionSchema
    );