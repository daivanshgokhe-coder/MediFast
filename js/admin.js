// ========================================
// MediFast - Admin Dashboard
// ========================================

const ADMIN_ORDERS_API = "https://medifast-oanf.onrender.com/api/orders/admin/all";

const ORDERS_API = "https://medifast-oanf.onrender.com/api/orders";


const MEDICINES_API = "https://medifast-oanf.onrender.com/api/medicines";


// ========================================
// GET TOKEN
// ========================================

function getAdminToken() {

    return localStorage.getItem(
        "medifastToken"
    );
}


// ========================================
// FORMAT PRICE
// ========================================

function formatAdminPrice(amount) {

    return `₹${Number(
        amount || 0
    ).toLocaleString("en-IN")}`;
}


// ========================================
// FORMAT DATE
// ========================================

function formatAdminDate(
    dateValue
) {

    if (!dateValue) {
        return "N/A";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "N/A";
    }

    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeAdminHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ========================================
// SHOW MESSAGE
// ========================================

function showAdminMessage(
    message,
    type = "error"
) {

    const box =
        document.getElementById(
            "admin-message"
        );

    if (!box) {
        alert(message);
        return;
    }

    box.textContent =
        message;

    box.className =
        `admin-message ${type}`;

    box.style.display =
        "block";


    setTimeout(
        function () {

            box.style.display =
                "none";

        },
        3000
    );
}


// ========================================
// CHECK ADMIN
// ========================================

function checkAdminAccess() {

    const token =
        localStorage.getItem(
            "medifastToken"
        );

    const userText =
        localStorage.getItem(
            "medifastUser"
        );


    if (
        !token ||
        !userText
    ) {

        window.location.href =
            "login.html";

        return false;
    }


    try {

        const user =
            JSON.parse(
                userText
            );


        if (
            user.role !== "admin"
        ) {

            showAdminMessage(
                "Admin access required."
            );


            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                1500
            );


            return false;
        }


    } catch (error) {

        console.error(
            "Admin User Error:",
            error
        );


        window.location.href =
            "login.html";


        return false;
    }


    return true;
}


// ========================================
// LOAD ADMIN DASHBOARD
// ========================================

async function loadAdminDashboard() {

    if (
        !checkAdminAccess()
    ) {
        return;
    }


    const token =
        getAdminToken();


    try {

        const headers = {

            "Authorization":
                `Bearer ${token}`

        };


        // ========================================
        // GET ORDERS
        // ========================================

        const ordersResponse =
            await fetch(
                ADMIN_ORDERS_API,
                {
                    method: "GET",
                    headers
                }
            );


        let ordersData = {};


        try {

            ordersData =
                await ordersResponse.json();

        } catch (error) {

            console.warn(
                "Orders response was not JSON."
            );

        }


        if (
            !ordersResponse.ok
        ) {

            throw new Error(
                ordersData.message ||
                "Unable to load admin orders."
            );
        }


        const orders =
            Array.isArray(
                ordersData.orders
            )
                ? ordersData.orders
                : [];


        // ========================================
        // GET MEDICINES
        // ========================================

        const medicinesResponse =
            await fetch(
                MEDICINES_API,
                {
                    cache: "no-store"
                }
            );


        let medicinesData = {};


        try {

            medicinesData =
                await medicinesResponse.json();

        } catch (error) {

            console.warn(
                "Medicines response was not JSON."
            );

        }


        if (
            !medicinesResponse.ok
        ) {

            throw new Error(
                medicinesData.message ||
                "Unable to load medicines."
            );
        }


        const medicines =
            Array.isArray(
                medicinesData.medicines
            )
                ? medicinesData.medicines
                : [];


        // ========================================
        // CALCULATE STATS
        // ========================================

        const totalOrders =
            orders.length;


        const totalRevenue =
            orders.reduce(
                function (
                    sum,
                    order
                ) {

                    return (
                        sum +
                        Number(
                            order.total || 0
                        )
                    );

                },
                0
            );


        const pendingOrders =
            orders.filter(
                function (order) {

                    return ![
                        "Delivered",
                        "Cancelled"
                    ].includes(
                        order.status
                    );

                }
            ).length;


        const totalMedicines =
            medicines.length;


        // ========================================
        // UPDATE STATS
        // ========================================

        const totalOrdersElement =
            document.getElementById(
                "admin-total-orders"
            );


        const revenueElement =
            document.getElementById(
                "admin-total-revenue"
            );


        const medicinesElement =
            document.getElementById(
                "admin-total-medicines"
            );


        const pendingElement =
            document.getElementById(
                "admin-pending-orders"
            );


        if (
            totalOrdersElement
        ) {

            totalOrdersElement.textContent =
                totalOrders;

        }


        if (
            revenueElement
        ) {

            revenueElement.textContent =
                formatAdminPrice(
                    totalRevenue
                );

        }


        if (
            medicinesElement
        ) {

            medicinesElement.textContent =
                totalMedicines;

        }


        if (
            pendingElement
        ) {

            pendingElement.textContent =
                pendingOrders;

        }


        // ========================================
        // RENDER
        // ========================================

        renderAdminOrders(
            orders
        );


        renderAdminMedicines(
            medicines
        );


        const loading =
            document.getElementById(
                "admin-loading"
            );


        if (loading) {

            loading.style.display =
                "none";

        }


    } catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );


        showAdminMessage(
            error.message ||
            "Unable to load Admin Dashboard."
        );


        const loading =
            document.getElementById(
                "admin-loading"
            );


        if (loading) {

            loading.style.display =
                "none";

        }

    }
}


// ========================================
// DELETE ORDER
// ========================================

async function deleteAdminOrder(
    orderId
) {

    if (!orderId) {

        showAdminMessage(
            "Invalid order ID."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this order?"
        );


    if (!confirmed) {
        return;
    }


    const token =
        getAdminToken();


    try {

        const response =
            await fetch(
                `${ORDERS_API}/${encodeURIComponent(
                    orderId
                )}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        let data = {};


        try {

            data =
                await response.json();

        } catch (error) {

            console.warn(
                "Delete order response was not JSON."
            );

        }


        if (
            !response.ok
        ) {

            throw new Error(
                data.message ||
                "Unable to delete order."
            );
        }


        showAdminMessage(
            "Order deleted successfully.",
            "success"
        );


        // Refresh dashboard
        await loadAdminDashboard();


    } catch (error) {

        console.error(
            "Delete Order Error:",
            error
        );


        showAdminMessage(
            error.message ||
            "Unable to delete order."
        );

    }
}


// ========================================
// DELETE MEDICINE
// ========================================

async function deleteAdminMedicine(
    medicineId
) {

    if (!medicineId) {

        showAdminMessage(
            "Invalid medicine ID."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this medicine?"
        );


    if (!confirmed) {
        return;
    }


    const token =
        getAdminToken();


    try {

        const response =
            await fetch(
                `${MEDICINES_API}/${encodeURIComponent(
                    medicineId
                )}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        let data = {};


        try {

            data =
                await response.json();

        } catch (error) {

            console.warn(
                "Delete medicine response was not JSON."
            );

        }


        if (
            !response.ok
        ) {

            throw new Error(
                data.message ||
                "Unable to delete medicine."
            );
        }


        showAdminMessage(
            "Medicine deleted successfully.",
            "success"
        );


        // Refresh dashboard
        await loadAdminDashboard();


    } catch (error) {

        console.error(
            "Delete Medicine Error:",
            error
        );


        showAdminMessage(
            error.message ||
            "Unable to delete medicine."
        );

    }
}


// ========================================
// RENDER ORDERS
// ========================================

function renderAdminOrders(
    orders
) {

    const container =
        document.getElementById(
            "admin-orders"
        );


    if (!container) {
        return;
    }


    if (
        !orders.length
    ) {

        container.innerHTML = `

            <div class="admin-empty">
                No orders found.
            </div>

        `;

        return;
    }


    container.innerHTML =
        orders
            .slice(0, 10)
            .map(
                function (order) {

                    const customer =
                        order.customer ||
                        {};


                    const status =
                        order.status ||
                        "Order Placed";


                    const orderId =
                        String(
                            order._id ||
                            ""
                        );


                    return `

                        <div class="admin-order-card">

                            <div>

                                <strong>
                                    Order #${escapeAdminHtml(
                                        orderId
                                            .slice(-8)
                                            .toUpperCase()
                                    )}
                                </strong>

                                <p>
                                    Customer:
                                    ${escapeAdminHtml(
                                        customer.name ||
                                        "N/A"
                                    )}
                                </p>

                                <small>
                                    ${formatAdminDate(
                                        order.createdAt
                                    )}
                                </small>

                            </div>


                            <div
                                class="admin-order-right"
                            >

                                <strong>
                                    ${formatAdminPrice(
                                        order.total
                                    )}
                                </strong>


                                <span
                                    class="admin-status"
                                >
                                    ${escapeAdminHtml(
                                        status
                                    )}
                                </span>


                                <a
                                    href="order-tracking.html?id=${encodeURIComponent(
                                        orderId
                                    )}"
                                    class="admin-track-btn"
                                >
                                    Track
                                </a>


                                <button
                                    type="button"
                                    class="admin-delete-btn"
                                    onclick="deleteAdminOrder('${escapeAdminHtml(
                                        orderId
                                    )}')"
                                >
                                    🗑️ Delete
                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");
}


// ========================================
// RENDER MEDICINES
// ========================================

function renderAdminMedicines(
    medicines
) {

    const container =
        document.getElementById(
            "admin-medicines"
        );


    if (!container) {
        return;
    }


    if (
        !medicines.length
    ) {

        container.innerHTML = `

            <div class="admin-empty">
                No medicines found.
            </div>

        `;

        return;
    }


    container.innerHTML =
        medicines
            .slice(0, 12)
            .map(
                function (medicine) {

                    const medicineId =
                        String(
                            medicine._id ||
                            ""
                        );


                    return `

                        <div
                            class="admin-medicine-card"
                        >

                            <div
                                class="admin-medicine-icon"
                            >
                                ${escapeAdminHtml(
                                    medicine.emoji ||
                                    "💊"
                                )}
                            </div>


                            <div>

                                <strong>
                                    ${escapeAdminHtml(
                                        medicine.name
                                    )}
                                </strong>


                                <p>
                                    ${formatAdminPrice(
                                        medicine.price
                                    )}
                                </p>


                                <small>
                                    Stock:
                                    ${Number(
                                        medicine.stock ||
                                        0
                                    )}
                                </small>


                                <br>


                                <button
                                    type="button"
                                    class="admin-delete-btn"
                                    onclick="deleteAdminMedicine('${escapeAdminHtml(
                                        medicineId
                                    )}')"
                                >
                                    🗑️ Delete
                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");
}


// ========================================
// LOGOUT
// ========================================

function adminLogout() {

    localStorage.removeItem(
        "medifastToken"
    );

    localStorage.removeItem(
        "medifastUser"
    );

    window.location.href =
        "login.html";
}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const logoutButton =
            document.getElementById(
                "admin-logout"
            );


        if (
            logoutButton
        ) {

            logoutButton.addEventListener(
                "click",
                adminLogout
            );

        }


        loadAdminDashboard();

    }
);