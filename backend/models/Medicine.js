const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        image: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            default: ""
        },

        stock: {
            type: Number,
            default: 100,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Medicine", medicineSchema);