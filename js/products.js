
// ========================================
// MediFast - Products
// js/products.js
// ========================================


const PRODUCTS_API = "https://medifast-oanf.onrender.com/api/medicines";


let products = [];

// ========================================
// Load Medicines
// ========================================
async function loadProducts() {
    const grid = document.getElementById("products-grid");

    if (!grid) return;

    grid.innerHTML = `
        <div class="message">
            Loading medicines...
        </div>
    `;

    try {
        const response = await fetch(PRODUCTS_API, {
            method: "GET",
            cache: "no-store"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to load medicines"
            );
        }

        products = Array.isArray(data.medicines)
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
        document.getElementById(
            "products-grid"
        );

    if (!grid) return;

    if (!list.length) {

        grid.innerHTML = `
            <div class="message">
                No medicines found.
            </div>
        `;

        return;
    }

    grid.innerHTML = list.map(function (product) {

        const id =
            product._id;

        return `
            <div class="product-card">

                <div class="product-image">
                    <div class="image-placeholder">
                        ${product.emoji || "💊"}
                    </div>
                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${product.category || "Medicine"}
                    </span>

                    <h3>
                        ${product.name || "Medicine"}
                    </h3>

                    <p>
                        ${product.description || ""}
                    </p>

                    <div class="product-bottom">

                        <strong>
                            ₹${Number(product.price || 0).toLocaleString("en-IN")}
                        </strong>

                        <button
                            type="button"
                            class="btn btn-primary view-details-btn"
                            data-id="${id}"
                        >
                            View Details
                        </button>

                    </div>

                </div>

            </div>
        `;

    }).join("");

    // View Details buttons
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
// Search
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
        products.filter(function (product) {

            return (
                String(product.name || "")
                    .toLowerCase()
                    .includes(text)
                ||
                String(product.category || "")
                    .toLowerCase()
                    .includes(text)
                ||
                String(product.description || "")
                    .toLowerCase()
                    .includes(text)
            );

        });

    displayProducts(filtered);
}

// ========================================
// Category Filter
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
        products.filter(function (product) {

            return String(
                product.category || ""
            ).toLowerCase() ===
            String(category).toLowerCase();

        });

    displayProducts(filtered);
}

// ========================================
// Page Load
// ========================================
document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProducts();

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
