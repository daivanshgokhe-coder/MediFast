const express = require("express");

const router =
    express.Router();


// ========================================
// CONTROLLERS
// ========================================

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    deleteOrder
} = require("../controllers/orderController");


// ========================================
// MIDDLEWARE
// ========================================

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


// ========================================
// CREATE ORDER
// POST /api/orders
// ========================================

router.post(
    "/",
    authMiddleware,
    createOrder
);


// ========================================
// GET ALL ORDERS - ADMIN
// GET /api/orders/admin/all
// ========================================

router.get(
    "/admin/all",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);


// ========================================
// GET LOGGED-IN USER ORDERS
// GET /api/orders
// ========================================

router.get(
    "/",
    authMiddleware,
    getOrders
);


// ========================================
// GET SINGLE USER ORDER
// GET /api/orders/:id
// ========================================

router.get(
    "/:id",
    authMiddleware,
    getOrderById
);


// ========================================
// UPDATE ORDER STATUS - ADMIN
// PUT /api/orders/:id/status
// ========================================

router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);


// ========================================
// DELETE ORDER - ADMIN
// DELETE /api/orders/:id
// ========================================

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteOrder
);


// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;