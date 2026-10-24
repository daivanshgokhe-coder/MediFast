const mongoose = require("mongoose");

const Order =
    require("../models/Order");


// ========================================
// CREATE ORDER
// ========================================

async function createOrder(
    req,
    res
) {

    try {

        const {
            items,
            customer,
            paymentMethod,
            subtotal,
            delivery,
            total
        } = req.body;


        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Order must contain at least one item"
            });
        }


        if (
            !customer ||
            !customer.name ||
            !customer.phone ||
            !customer.address ||
            !customer.city ||
            !customer.state ||
            !customer.pincode
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Complete customer details are required"
            });
        }


        if (
            ![
                "COD",
                "UPI",
                "Card"
            ].includes(paymentMethod)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment method"
            });
        }


        const order =
            await Order.create({

                userId:
                    req.user._id,

                items,

                customer,

                paymentMethod,

                subtotal:
                    Number(subtotal),

                delivery:
                    Number(delivery || 0),

                total:
                    Number(total)

            });


        res.status(201).json({

            success: true,

            message:
                "Order placed successfully",

            order

        });

    } catch (error) {

        console.error(
            "Create Order Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to create order"
        });
    }
}


// ========================================
// GET USER ORDERS
// ========================================

async function getOrders(
    req,
    res
) {

    try {

        const orders =
            await Order.find({
                userId:
                    req.user._id
            })
            .sort({
                createdAt: -1
            });


        res.json({

            success: true,

            count:
                orders.length,

            orders

        });

    } catch (error) {

        console.error(
            "Get Orders Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to fetch orders"
        });
    }
}


// ========================================
// GET SINGLE ORDER
// ========================================

async function getOrderById(
    req,
    res
) {

    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid order ID"
            });
        }


        const order =
            await Order.findOne({

                _id:
                    req.params.id,

                userId:
                    req.user._id

            });


        if (!order) {

            return res.status(404).json({
                success: false,
                message:
                    "Order not found"
            });
        }


        res.json({

            success: true,

            order

        });

    } catch (error) {

        console.error(
            "Get Order Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to fetch order"
        });
    }
}


// ========================================
// UPDATE ORDER STATUS
// ========================================

async function updateOrderStatus(
    req,
    res
) {

    try {

        const {
            status
        } = req.body;


        const allowedStatuses = [

            "Order Placed",
            "Order Confirmed",
            "Packed",
            "Out for Delivery",
            "Delivered",
            "Cancelled"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid order status"
            });
        }


        const order =
            await Order.findByIdAndUpdate(
                req.params.id,
                {
                    status
                },
                {
                    new: true,
                    runValidators: true
                }
            );


        if (!order) {

            return res.status(404).json({
                success: false,
                message:
                    "Order not found"
            });
        }


        res.json({

            success: true,

            message:
                "Order status updated successfully",

            order

        });

    } catch (error) {

        console.error(
            "Update Order Status Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to update order status"
        });
    }
}


// ========================================
// GET ALL ORDERS - ADMIN
// ========================================

async function getAllOrders(
    req,
    res
) {

    try {

        const orders =
            await Order.find()
                .populate(
                    "userId",
                    "name email phone"
                )
                .sort({
                    createdAt: -1
                });


        res.json({

            success: true,

            count:
                orders.length,

            orders

        });

    } catch (error) {

        console.error(
            "Get All Orders Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to fetch all orders"

        });
    }
}


// ========================================
// DELETE ORDER - ADMIN
// ========================================

async function deleteOrder(
    req,
    res
) {

    try {

        // Check ObjectId
        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid order ID"
            });
        }


        const order =
            await Order.findByIdAndDelete(
                req.params.id
            );


        if (!order) {

            return res.status(404).json({
                success: false,
                message:
                    "Order not found"
            });
        }


        res.json({

            success: true,

            message:
                "Order deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete Order Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to delete order"

        });
    }
}


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {

    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    deleteOrder

};