const mongoose = require("mongoose");

const orderItemSchema =
    new mongoose.Schema(
        {
            id: {
                type: String,
                default: ""
            },

            name: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true,
                min: 0
            },

            emoji: {
                type: String,
                default: "💊"
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        },

        {
            _id: false
        }
    );


const orderSchema =
    new mongoose.Schema(
        {

            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            items: {
                type: [orderItemSchema],
                required: true
            },

            customer: {

                name: {
                    type: String,
                    required: true
                },

                phone: {
                    type: String,
                    required: true
                },

                address: {
                    type: String,
                    required: true
                },

                city: {
                    type: String,
                    required: true
                },

                state: {
                    type: String,
                    required: true
                },

                pincode: {
                    type: String,
                    required: true
                }

            },

            paymentMethod: {
                type: String,
                required: true,
                enum: [
                    "COD",
                    "UPI",
                    "Card"
                ]
            },

            subtotal: {
                type: Number,
                required: true,
                min: 0
            },

            delivery: {
                type: Number,
                default: 0,
                min: 0
            },

            total: {
                type: Number,
                required: true,
                min: 0
            },

            status: {
                type: String,
                enum: [
                    "Order Placed",
                    "Order Confirmed",
                    "Packed",
                    "Out for Delivery",
                    "Delivered",
                    "Cancelled"
                ],
                default: "Order Placed"
            }

        },

        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "Order",
        orderSchema
    );