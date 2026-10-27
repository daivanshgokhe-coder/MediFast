// ========================================
// MediFast - Products
// js/products.js
// ========================================

const PRODUCTS_API =
    "https://medifast-oanf.onrender.com/api/medicines";

let products = [];

// ========================================
// Load Medicines
// ========================================

async function loadProducts() {

    const grid =
        document.getElementById("products-grid");

    if (!grid) return;

    grid.innerHTML = `
        <div class="message">
            Loading medicines...
        </div>
    `;

    try {

        const response =
            await fetch(PRODUCTS_API, {
                method: "GET",
                cache: "no-store"
            });

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to load medicines"
            );
        }

        products =
            Array.isArray(data.medicines)
                ? data.medicines
                : [];

        window.products = products;

        displayProducts(products);

    } catch (error) {

        console.error(
            "Products Error:",
            error
        );

        grid.innerHTML = `
            <div class="message error">
                Unable to load medicines.
                <br><br>
                ${error.message}
            </div>
        `;
    }
}

// ========================================
// Display Medicines
// ========================================

function displayProducts(list) {

    const grid =
        document.getElementById("products-grid");

    if (!grid) return;

    if (!list.length) {

        grid.innerHTML = `
            <div class="message">
                No medicines found.
            </div>
        `;

        return;
    }

    grid.innerHTML =
        list.map(function (product) {

            const id =
                product._id;

            const price =
                Number(product.price || 0)
                    .toLocaleString("en-IN");

            const category =
                product.category ||
                "Medicine";

            const name =
                product.name ||
                "Medicine";

            const description =
                product.description ||
                "No description available.";

            const emoji =
                product.emoji ||
                "💊";

            return `
                <div class="product-card">

                    <!-- Product Image -->
                    <div class="product-image">
                        <div class="image-placeholder">
                            ${emoji}
                        </div>
                    </div>

                    <!-- Product Information -->
                    <div class="product-info">

                        <span class="product-category">
                            ${category}
                        </span>

                        <h3>
                            ${name}
                        </h3>

                        <p>
                            ${description}
                        </p>

                        <!-- Price + View Details -->
                        <div class="product-bottom">

                            <strong>
                                ₹${price}
                            </strong>

                            <button
                                type="button"
                                class="view-details-btn"
                                data-id="${id}"
                            >
                                View Details
                            </button>

                        </div>

                    </div>

                </div>
            `;

        }).join("");

    // ========================================
    // View Details
    // ========================================

    document
        .querySelectorAll(".view-details-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        button.dataset.id;

                    if (!id) {

                        console.error(
                            "Medicine ID missing"
                        );

                        return;
                    }

                    window.location.href =
                        `product-details.html?id=${encodeURIComponent(id)}`;
                }
            );

        });
}

// ========================================
// UPDATE CART COUNT
// ========================================

function updateCartCount() {

    let cart = [];

    try {

        const savedCart =
            localStorage.getItem(
                "medifastCart"
            );

        cart =
            savedCart
                ? JSON.parse(savedCart)
                : [];

        if (!Array.isArray(cart)) {
            cart = [];
        }

    } catch (error) {

        console.error(
            "Cart read error:",
            error
        );

        cart = [];
    }

    const count =
        cart.reduce(
            function (total, item) {

                return total +
                    Number(
                        item.quantity || 0
                    );

            },
            0
        );

    document
        .querySelectorAll(
            ".cart-count"
        )
        .forEach(
            function (element) {

                element.textContent =
                    count;
            }
        );

    const cartCount =
        document.getElementById(
            "cart-count"
        );

    if (cartCount) {
        cartCount.textContent =
            count;
    }
}

// ========================================
// CART MESSAGE
// ========================================

function showCartMessage(message) {

    let messageElement =
        document.getElementById(
            "cart-message"
        );

    if (!messageElement) {

        messageElement =
            document.createElement(
                "div"
            );

        messageElement.id =
            "cart-message";

        messageElement.className =
            "message success";

        document.body.appendChild(
            messageElement
        );
    }

    messageElement.textContent =
        message;

    messageElement.style.display =
        "block";

    setTimeout(
        function () {

            messageElement.style.display =
                "none";

        },
        2000
    );
}

// ========================================
// SEARCH
// ========================================

function searchProducts() {

    const input =
        document.getElementById(
            "product-search"
        );

    if (!input) return;

    const text =
        input.value
            .trim()
            .toLowerCase();

    if (!text) {

        displayProducts(products);

        return;
    }

    const filtered =
        products.filter(
            function (product) {

                return (
                    String(
                        product.name || ""
                    )
                        .toLowerCase()
                        .includes(text)

                    ||

                    String(
                        product.category || ""
                    )
                        .toLowerCase()
                        .includes(text)

                    ||

                    String(
                        product.description || ""
                    )
                        .toLowerCase()
                        .includes(text)
                );

            }
        );

    displayProducts(filtered);
}

// ========================================
// CATEGORY FILTER
// ========================================

function filterProducts(category) {

    if (
        !category ||
        category === "all"
    ) {

        displayProducts(products);

        return;
    }

    const filtered =
        products.filter(
            function (product) {

                return String(
                    product.category || ""
                )
                    .toLowerCase() ===
                    String(category)
                        .toLowerCase();

            }
        );

    displayProducts(filtered);
}

// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProducts();

        updateCartCount();

        const search =
            document.getElementById(
                "product-search"
            );

        if (search) {

            search.addEventListener(
                "input",
                searchProducts
            );
        }

    }
);