
// ========================================
// MediFast - Main JavaScript
// Location: js/main.js
// ========================================


// ========================================
// GET CART
// ========================================

function getCart() {
    try {
        const cart = localStorage.getItem("medifastCart");

        if (!cart) {
            return [];
        }

        const parsedCart = JSON.parse(cart);

        return Array.isArray(parsedCart)
            ? parsedCart
            : [];

    } catch (error) {
        console.error("Cart data error:", error);
        return [];
    }
}


// ========================================
// SAVE CART
// ========================================

function saveCart(cart) {
    if (!Array.isArray(cart)) {
        cart = [];
    }

    localStorage.setItem(
        "medifastCart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


// ========================================
// CLEAR CART
// ========================================

function clearCart() {
    localStorage.removeItem("medifastCart");
    updateCartCount();
}


// ========================================
// UPDATE CART COUNT
// ========================================

function updateCartCount() {

    const cart = getCart();

    const count = cart.reduce(
        function (total, item) {

            return (
                total +
                Number(item.quantity || 1)
            );

        },
        0
    );

    const cartCountElements =
        document.querySelectorAll(".cart-count");

    cartCountElements.forEach(
        function (element) {
            element.textContent = count;
        }
    );
}


// ========================================
// GET CURRENT USER
// ========================================

function getUser() {

    try {

        const user =
            localStorage.getItem(
                "medifastUser"
            );

        if (!user) {
            return null;
        }

        return JSON.parse(user);

    } catch (error) {

        console.error(
            "User data error:",
            error
        );

        return null;
    }
}


// ========================================
// GET AUTH TOKEN
// ========================================

function getToken() {

    return localStorage.getItem(
        "medifastToken"
    );
}


// ========================================
// CHECK LOGIN
// ========================================

function isUserLoggedIn() {

    const token =
        localStorage.getItem(
            "medifastToken"
        );

    const user =
        localStorage.getItem(
            "medifastUser"
        );

    return !!(
        token &&
        user
    );
}


// ========================================
// REQUIRE LOGIN
// ========================================

function requireLogin() {

    if (!isUserLoggedIn()) {

        window.location.replace(
            "login.html"
        );

        return false;
    }

    return true;
}


// ========================================
// LOGOUT
// ========================================

function logout() {

    // IMPORTANT:
    // Login data is removed ONLY when
    // user intentionally clicks Logout.

    localStorage.removeItem(
        "medifastToken"
    );

    localStorage.removeItem(
        "medifastUser"
    );

    window.location.replace(
        "index.html"
    );
}


// ========================================
// UPDATE NAVIGATION
// ========================================

function updateNavigation() {

    const loggedIn =
        isUserLoggedIn();

    const user =
        getUser();

    const loginLinks =
        document.querySelectorAll(
            'a[href="login.html"]'
        );

    loginLinks.forEach(
        function (link) {

            if (loggedIn) {

                link.textContent =
                    "Logout";

                link.href = "#";

                link.onclick =
                    function (event) {

                        event.preventDefault();

                        logout();
                    };

            } else {

                link.textContent =
                    "Login";

                link.href =
                    "login.html";

                link.onclick = null;
            }
        }
    );


    // Optional user name display
    const userNameElements =
        document.querySelectorAll(
            ".user-name"
        );

    userNameElements.forEach(
        function (element) {

            if (user) {

                element.textContent =
                    user.name ||
                    user.email ||
                    "User";

            } else {

                element.textContent =
                    "";
            }
        }
    );
}


// ========================================
// FORMAT PRICE
// ========================================

function formatPrice(price) {

    return "₹" +
        Number(
            price || 0
        ).toLocaleString(
            "en-IN"
        );
}


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(
    message,
    type = "error"
) {

    const messageElement =
        document.getElementById(
            "message"
        );

    if (!messageElement) {

        alert(message);

        return;
    }

    messageElement.textContent =
        message;

    messageElement.className =
        `message ${type}`;

    messageElement.style.display =
        "block";

    setTimeout(
        function () {

            messageElement.style.display =
                "none";

        },
        3000
    );
}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        updateNavigation();

    }
);
