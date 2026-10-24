// ========================================
// MediFast - Order Tracking
// ========================================

const TRACKING_API = "http://localhost:5000/api/orders";


// ========================================
// GET ORDER ID FROM URL
// ========================================

function getOrderIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}


// ========================================
// FORMAT PRICE
// ========================================

function formatTrackingPrice(amount) {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}


// ========================================
// FORMAT DATE
// ========================================

function formatTrackingDate(dateValue) {
    if (!dateValue) {
        return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeTrackingHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// STATUS INDEX
// ========================================

function getStatusIndex(status) {
    const statuses = [
        "Order Placed",
        "Order Confirmed",
        "Packed",
        "Out for Delivery",
        "Delivered"
    ];

    const index = statuses.indexOf(status);

    return index === -1 ? 0 : index;
}


// ========================================
// CREATE TIMELINE
// ========================================

function createTrackingTimeline(orderStatus) {
    const statuses = [
        {
            name: "Order Placed",
            icon: "📝",
            description: "Your order has been placed successfully."
        },
        {
            name: "Order Confirmed",
            icon: "✅",
            description: "Your order has been confirmed."
        },
        {
            name: "Packed",
            icon: "📦",
            description: "Your medicines have been packed."
        },
        {
            name: "Out for Delivery",
            icon: "🚚",
            description: "Your order is on the way."
        },
        {
            name: "Delivered",
            icon: "🎉",
            description: "Your order has been delivered."
        }
    ];

    const currentIndex = getStatusIndex(orderStatus);

    return statuses.map((step, index) => {
        let className = "tracking-step";

        if (index < currentIndex) {
            className += " completed";
        }

        if (index === currentIndex) {
            className += " current";
        }

        return `
            <div class="${className}">

                <div class="tracking-step-icon">
                    ${step.icon}
                </div>

                <div class="tracking-step-content">

                    <h3>
                        ${step.name}
                    </h3>

                    <p>
                        ${step.description}
                    </p>

                </div>

            </div>
        `;
    }).join("");
}


// ========================================
// SHOW ERROR
// ========================================

function showTrackingError(title, message) {
    const container = document.getElementById("tracking-container");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="tracking-not-found">

            <div class="tracking-not-found-icon">
                ⚠️
            </div>

            <h2>
                ${escapeTrackingHtml(title)}
            </h2>

            <p>
                ${escapeTrackingHtml(message)}
            </p>

            <div class="tracking-actions">

                <a
                    href="orders.html"
                    class="btn btn-primary"
                >
                    ← My Orders
                </a>

                <a
                    href="products.html"
                    class="btn btn-secondary"
                >
                    Continue Shopping
                </a>

            </div>

        </div>
    `;
}


// ========================================
// DISPLAY ORDER
// ========================================

function displayOrderTracking(order) {
    const container = document.getElementById("tracking-container");

    if (!container) {
        console.error("tracking-container not found.");
        return;
    }

    const orderStatus = order.status || "Order Placed";

    const customer = order.customer || {};

    const items = Array.isArray(order.items)
        ? order.items
        : [];

    const subtotal = Number(order.subtotal || 0);

    const delivery = Number(order.delivery || 0);

    const total = Number(
        order.total || subtotal + delivery
    );

    const orderNumber = order._id
        ? String(order._id).slice(-8).toUpperCase()
        : "N/A";


    // ========================================
    // ORDER ITEMS
    // ========================================

    let itemsHTML = "";

    if (items.length === 0) {

        itemsHTML = `
            <p>
                No order items found.
            </p>
        `;

    } else {

        itemsHTML = items.map(item => {

            const quantity = Number(item.quantity || 0);

            const price = Number(item.price || 0);

            const itemTotal = price * quantity;

            return `
                <div class="tracking-item">

                    <div class="tracking-item-left">

                        <span class="tracking-item-emoji">
                            ${escapeTrackingHtml(
                                item.emoji || "💊"
                            )}
                        </span>

                        <div>

                            <div class="tracking-item-name">
                                ${escapeTrackingHtml(
                                    item.name || "Medicine"
                                )}
                            </div>

                            <span class="tracking-item-quantity">
                                Quantity: ${quantity}
                            </span>

                        </div>

                    </div>

                    <div class="tracking-item-price">
                        ${formatTrackingPrice(itemTotal)}
                    </div>

                </div>
            `;

        }).join("");
    }


    // ========================================
    // COMPLETE ORDER HTML
    // ========================================

    container.innerHTML = `

        <div class="tracking-card">


            <!-- ORDER HEADER -->

            <div class="tracking-order-header">

                <div>

                    <h2>
                        Order #${orderNumber}
                    </h2>

                    <div class="tracking-order-id">
                        Order ID:
                        ${escapeTrackingHtml(order._id)}
                    </div>

                    <div class="tracking-order-id">
                        Order Date:
                        ${formatTrackingDate(order.createdAt)}
                    </div>

                </div>

                <span class="tracking-status">
                    ${escapeTrackingHtml(orderStatus)}
                </span>

            </div>


            <!-- CUSTOMER DETAILS -->

            <div class="tracking-details">

                <div class="tracking-detail-box">

                    <span>
                        Customer
                    </span>

                    <strong>
                        ${escapeTrackingHtml(
                            customer.name || "N/A"
                        )}
                    </strong>

                </div>


                <div class="tracking-detail-box">

                    <span>
                        Mobile
                    </span>

                    <strong>
                        ${escapeTrackingHtml(
                            customer.phone || "N/A"
                        )}
                    </strong>

                </div>


                <div class="tracking-detail-box">

                    <span>
                        Delivery Address
                    </span>

                    <strong>
                        ${escapeTrackingHtml(
                            customer.address || "N/A"
                        )}
                    </strong>

                </div>


                <div class="tracking-detail-box">

                    <span>
                        City / State
                    </span>

                    <strong>
                        ${escapeTrackingHtml(
                            customer.city || "N/A"
                        )}
                        ,
                        ${escapeTrackingHtml(
                            customer.state || "N/A"
                        )}
                    </strong>

                </div>


                <div class="tracking-detail-box">

                    <span>
                        Pincode
                    </span>

                    <strong>
                        ${escapeTrackingHtml(
                            customer.pincode || "N/A"
                        )}
                    </strong>

                </div>


                <div class="tracking-detail-box">

                    <span>
                        Payment Method
                    </span>

                    <strong>
                        ${escapeTrackingHtml(
                            order.paymentMethod || "N/A"
                        )}
                    </strong>

                </div>

            </div>


            <!-- TRACKING TIMELINE -->

            <h2 class="timeline-title">
                Order Status
            </h2>

            <div class="tracking-timeline">

                ${createTrackingTimeline(orderStatus)}

            </div>


            <!-- ORDER ITEMS -->

            <div class="tracking-items-section">

                <h2>
                    Order Items
                </h2>

                ${itemsHTML}


                <div class="tracking-total">

                    <span>
                        Subtotal
                    </span>

                    <strong>
                        ${formatTrackingPrice(subtotal)}
                    </strong>

                </div>


                <div class="tracking-total">

                    <span>
                        Delivery
                    </span>

                    <strong>
                        ${
                            delivery === 0
                                ? "FREE"
                                : formatTrackingPrice(delivery)
                        }
                    </strong>

                </div>


                <div class="tracking-total">

                    <span>
                        Total Amount
                    </span>

                    <strong>
                        ${formatTrackingPrice(total)}
                    </strong>

                </div>

            </div>


            <!-- ACTION BUTTONS -->

            <div class="tracking-actions">

                <a
                    href="orders.html"
                    class="btn btn-primary"
                >
                    ← My Orders
                </a>

                <a
                    href="products.html"
                    class="btn btn-secondary"
                >
                    Continue Shopping
                </a>

                <a
                    href="admin.html"
                    class="btn btn-secondary"
                    id="tracking-admin-button"
                    style="display: none;"
                >
                    Admin Dashboard
                </a>

            </div>


        </div>
    `;
}


// ========================================
// LOAD ORDER FROM BACKEND
// ========================================

async function loadOrder() {
    const container = document.getElementById("tracking-container");

    if (!container) {
        console.error("tracking-container not found.");
        return;
    }


    // ========================================
    // GET ORDER ID
    // ========================================

    const orderId = getOrderIdFromURL();

    if (!orderId) {
        showTrackingError(
            "Order ID Missing",
            "Please open Track Order from My Orders."
        );
        return;
    }


    // ========================================
    // GET TOKEN
    // ========================================

    const token = localStorage.getItem("medifastToken");

    if (!token) {
        showTrackingError(
            "Login Required",
            "Please login before viewing your order."
        );
        return;
    }


    // ========================================
    // LOADING
    // ========================================

    container.innerHTML = `
        <div class="tracking-not-found">

            <div class="tracking-not-found-icon">
                ⏳
            </div>

            <h2>
                Loading Order...
            </h2>

            <p>
                Please wait while we fetch your order.
            </p>

        </div>
    `;


    try {

        // ========================================
        // API REQUEST
        // ========================================

        const response = await fetch(
            `${TRACKING_API}/${encodeURIComponent(orderId)}`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        let data = {};

        try {
            data = await response.json();
        } catch (error) {
            console.warn("Server response was not JSON.");
        }


        console.log(
            "MediFast Tracking Response:",
            data
        );


        // ========================================
        // API ERROR
        // ========================================

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to load order."
            );
        }


        // ========================================
        // GET ORDER
        // ========================================

        const order =
            data.order ||
            data;


        if (!order || !order._id) {
            throw new Error(
                "Order details were not found."
            );
        }


        // ========================================
        // DISPLAY ORDER
        // ========================================

        displayOrderTracking(order);


        // ========================================
        // ADMIN BUTTON
        // ========================================

        const userText =
            localStorage.getItem("medifastUser");

        const adminButton =
            document.getElementById(
                "tracking-admin-button"
            );


        if (adminButton && userText) {

            try {

                const user =
                    JSON.parse(userText);

                if (
                    user &&
                    user.role === "admin"
                ) {
                    adminButton.style.display =
                        "inline-block";
                }

            } catch (error) {

                console.error(
                    "Admin button error:",
                    error
                );

            }
        }


        // ========================================
        // UPDATE CART COUNT
        // ========================================

        if (typeof updateCartCount === "function") {
            updateCartCount();
        }


    } catch (error) {

        console.error(
            "Order Tracking Error:",
            error
        );

        showTrackingError(
            "Unable to Load Order",
            error.message ||
            "Something went wrong while loading your order."
        );
    }
}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "MediFast Order Tracking Loaded"
        );

        loadOrder();

    }
);