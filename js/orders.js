// ========================================
// MediFast - Orders
// Location: js/orders.js
// ========================================

const ORDERS_API =
    "http://localhost:5000/api/orders";


// ========================================
// GET TOKEN
// ========================================

function getOrdersToken() {

    return localStorage.getItem(
        "medifastToken"
    );
}


// ========================================
// FORMAT PRICE
// ========================================

function formatOrderPrice(
    price
) {

    return "₹" +
        Number(
            price || 0
        ).toLocaleString(
            "en-IN"
        );
}


// ========================================
// LOAD ORDERS FROM BACKEND
// ========================================

async function getOrdersFromAPI() {

    const token =
        getOrdersToken();


    if (!token) {

        throw new Error(
            "Please login to view your orders."
        );
    }


    const response =
        await fetch(
            ORDERS_API,
            {

                method: "GET",

                headers: {

                    "Authorization":
                        `Bearer ${token}`

                }

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Unable to fetch orders"
        );
    }


    return Array.isArray(
        data.orders
    )
        ? data.orders
        : [];
}


// ========================================
// DISPLAY NO ORDERS
// ========================================

function displayNoOrders() {

    const ordersList =
        document.getElementById(
            "orders-list"
        );


    const noOrders =
        document.getElementById(
            "no-orders"
        );


    if (ordersList) {

        ordersList.innerHTML =
            "";

    }


    if (noOrders) {

        noOrders.style.display =
            "block";

    }
}


// ========================================
// DISPLAY ORDERS
// ========================================

function displayOrders(
    orders
) {

    const ordersList =
        document.getElementById(
            "orders-list"
        );


    const noOrders =
        document.getElementById(
            "no-orders"
        );


    if (!ordersList) {

        return;
    }


    if (
        !orders ||
        orders.length === 0
    ) {

        displayNoOrders();

        return;
    }


    if (noOrders) {

        noOrders.style.display =
            "none";

    }


    ordersList.innerHTML =
        orders.map(
            function (order) {

                const items =
                    Array.isArray(
                        order.items
                    )
                        ? order.items
                        : [];


                const customer =
                    order.customer ||
                    {};


                const orderId =
                    order._id ||
                    order.id ||
                    "N/A";


                const status =
                    order.status ||
                    "Order Placed";


                const orderDate =
                    order.createdAt ||
                    order.date ||
                    "Date not available";


                const paymentMethod =
                    order.paymentMethod ||
                    "COD";


                const total =
                    Number(
                        order.total || 0
                    );


                const city =
                    customer.city ||
                    "-";


                const state =
                    customer.state ||
                    "-";


                const itemsHTML =
                    items.map(
                        function (item) {

                            const quantity =
                                Number(
                                    item.quantity || 0
                                );


                            const price =
                                Number(
                                    item.price || 0
                                );


                            const itemTotal =
                                price *
                                quantity;


                            return `

                                <div
                                    class="order-item"
                                >

                                    <div
                                        class="order-item-name"
                                    >

                                        <span
                                            class="order-item-emoji"
                                        >
                                            ${item.emoji || "💊"}
                                        </span>


                                        <div>

                                            <strong>
                                                ${item.name || "Medicine"}
                                            </strong>


                                            <div
                                                class="order-item-quantity"
                                            >
                                                Quantity:
                                                ${quantity}
                                            </div>

                                        </div>

                                    </div>


                                    <span
                                        class="order-item-price"
                                    >
                                        ${formatOrderPrice(itemTotal)}
                                    </span>

                                </div>

                            `;

                        }
                    ).join("");


                return `

                    <div
                        class="order-card"
                    >


                        <div
                            class="order-header"
                        >

                            <div>

                                <h3>
                                    Order #${orderId}
                                </h3>


                                <p
                                    class="order-date"
                                >
                                    ${formatOrderDate(
                                        orderDate
                                    )}
                                </p>

                            </div>


                            <span
                                class="order-status"
                            >
                                ${status}
                            </span>

                        </div>


                        <div
                            class="order-items"
                        >

                            ${itemsHTML}

                        </div>


                        <div
                            class="order-details"
                        >

                            <div
                                class="order-detail-box"
                            >

                                <span>
                                    Payment Method
                                </span>

                                <strong>
                                    ${paymentMethod}
                                </strong>

                            </div>


                            <div
                                class="order-detail-box"
                            >

                                <span>
                                    Delivery Location
                                </span>

                                <strong>
                                    ${city}, ${state}
                                </strong>

                            </div>


                            <div
                                class="order-detail-box"
                            >

                                <span>
                                    Items
                                </span>

                                <strong>
                                    ${items.length}
                                </strong>

                            </div>

                        </div>


                        <div
                            class="order-total"
                        >

                            <span>
                                Total Amount
                            </span>


                            <strong>
                                ${formatOrderPrice(total)}
                            </strong>

                        </div>


                        <div
                            class="order-actions"
                        >

                            <a
                                href="order-tracking.html?id=${encodeURIComponent(orderId)}"
                                class="track-order-btn"
                            >
                                📦 Track Order
                            </a>

                        </div>

                    </div>

                `;

            }
        ).join("");
}


// ========================================
// FORMAT DATE
// ========================================

function formatOrderDate(
    date
) {

    if (!date) {

        return "Date not available";
    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return date;
    }


    return parsedDate.toLocaleString(
        "en-IN"
    );
}


// ========================================
// LOAD ORDERS
// ========================================

async function loadOrders() {

    try {

        const orders =
            await getOrdersFromAPI();


        // Latest first

        orders.sort(
            function (a, b) {

                return new Date(
                    b.createdAt ||
                    b.date ||
                    0
                ) -
                new Date(
                    a.createdAt ||
                    a.date ||
                    0
                );

            }
        );


        displayOrders(
            orders
        );


    } catch (error) {

        console.error(
            "Orders API Error:",
            error
        );


        const ordersList =
            document.getElementById(
                "orders-list"
            );


        const noOrders =
            document.getElementById(
                "no-orders"
            );


        if (!getOrdersToken()) {

            if (ordersList) {

                ordersList.innerHTML = `

                    <div
                        class="message error"
                    >

                        Please login to view your orders.

                        <br><br>

                        <a
                            href="login.html"
                            class="btn btn-primary"
                        >
                            Login
                        </a>

                    </div>

                `;

            }


            if (noOrders) {

                noOrders.style.display =
                    "none";

            }


            return;
        }


        if (ordersList) {

            ordersList.innerHTML = `

                <div
                    class="message error"
                >

                    ${error.message}

                    <br><br>

                    Please make sure the
                    MediFast backend is running.

                </div>

            `;

        }

    }
}


// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadOrders();


        if (
            typeof updateCartCount ===
            "function"
        ) {

            updateCartCount();

        }

    }
);