
// ========================================
// MediFast - Product Details
// File: js/product-details.js
// ========================================


const MEDICINES_API =
    "https://medifast-oanf.onrender.com/api/medicines";


let currentMedicine = null;

// ========================================
// Get Medicine ID from URL
// ========================================
function getMedicineIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");
}

// ========================================
// Load Medicine from API
// ========================================
async function loadMedicine() {

    const medicineId =
        getMedicineIdFromURL();

    console.log(
        "Medicine ID:",
        medicineId
    );

    if (!medicineId) {

        showMessage(
            "Medicine ID is missing.",
            "error"
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${MEDICINES_API}/${encodeURIComponent(medicineId)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    cache: "no-store"
                }
            );

        const data =
            await response.json();

        console.log(
            "Medicine API Response:",
            data
        );

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Medicine not found."
            );
        }

        if (!data.medicine) {

            throw new Error(
                "Medicine data not found."
            );
        }

        currentMedicine =
            data.medicine;

        displayMedicine(
            currentMedicine
        );

        setQuantityLimit(
            currentMedicine.stock
        );

    } catch (error) {

        console.error(
            "Medicine Error:",
            error
        );

        showMessage(
            error.message ||
            "Medicine not found.",
            "error"
        );
    }
}

// ========================================
// Display Medicine
// ========================================
function displayMedicine(
    medicine
) {

    const nameElement =
        document.getElementById(
            "product-name"
        );

    const categoryElement =
        document.getElementById(
            "product-category"
        );

    const descriptionElement =
        document.getElementById(
            "product-description"
        );

    const priceElement =
        document.getElementById(
            "product-price"
        );

    const imageElement =
        document.getElementById(
            "product-image"
        );

    if (nameElement) {

        nameElement.textContent =
            medicine.name ||
            "Medicine";
    }

    if (categoryElement) {

        categoryElement.textContent =
            medicine.category ||
            "Medicine";
    }

    if (descriptionElement) {

        descriptionElement.textContent =
            medicine.description ||
            "No description available.";
    }

    if (priceElement) {

        priceElement.textContent =
            formatPrice(
                medicine.price
            );
    }

    // ====================================
    // Product Image / Emoji
    // ====================================

    if (imageElement) {

        if (medicine.image) {

            imageElement.innerHTML = `
                <img
                    src="images/products/${medicine.image}"
                    alt="${medicine.name || "Medicine"}"
                    style="
                        width: 220px;
                        height: 220px;
                        object-fit: contain;
                        display: block;
                    "
                >
            `;

        } else {

            imageElement.textContent =
                medicine.emoji ||
                "💊";
        }
    }

    // ====================================
    // Stock
    // ====================================

    const addButton =
        document.getElementById(
            "add-to-cart"
        );

    const stock =
        Number(
            medicine.stock || 0
        );

    if (addButton) {

        if (stock <= 0) {

            addButton.disabled =
                true;

            addButton.textContent =
                "Out of Stock";

            addButton.style.opacity =
                "0.6";

            addButton.style.cursor =
                "not-allowed";

        } else {

            addButton.disabled =
                false;

            addButton.textContent =
                "🛒 Add to Cart";

            addButton.style.opacity =
                "1";

            addButton.style.cursor =
                "pointer";
        }
    }
}

// ========================================
// Format Price
// ========================================
function formatPrice(price) {

    return (
        "₹" +
        Number(price || 0)
            .toLocaleString("en-IN")
    );
}

// ========================================
// Quantity Limit
// ========================================
function setQuantityLimit(
    stock
) {

    const input =
        document.getElementById(
            "product-quantity"
        );

    if (!input) {
        return;
    }

    const stockNumber =
        Number(stock || 0);

    input.min = "1";

    input.max =
        stockNumber > 0
            ? String(stockNumber)
            : "1";

    input.value = "1";
}

// ========================================
// Increase Quantity
// ========================================
function increaseQuantity() {

    const input =
        document.getElementById(
            "product-quantity"
        );

    if (!input) {
        return;
    }

    const max =
        Number(
            input.max || 20
        );

    let quantity =
        Number(
            input.value || 1
        );

    if (quantity < max) {

        quantity++;

        input.value =
            quantity;
    }
}

// ========================================
// Decrease Quantity
// ========================================
function decreaseQuantity() {

    const input =
        document.getElementById(
            "product-quantity"
        );

    if (!input) {
        return;
    }

    let quantity =
        Number(
            input.value || 1
        );

    if (quantity > 1) {

        quantity--;

        input.value =
            quantity;
    }
}

// ========================================
// Get Cart
// ========================================
function getCart() {

    try {

        const cart =
            localStorage.getItem(
                "medifastCart"
            );

        if (!cart) {
            return [];
        }

        const parsed =
            JSON.parse(cart);

        return Array.isArray(
            parsed
        )
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Cart Read Error:",
            error
        );

        return [];
    }
}

// ========================================
// Save Cart
// ========================================
function saveCart(cart) {

    localStorage.setItem(
        "medifastCart",
        JSON.stringify(cart)
    );
}

// ========================================
// Add to Cart
// ========================================
function addToCart() {

    if (!currentMedicine) {

        showMessage(
            "Medicine information is not available.",
            "error"
        );

        return;
    }

    const stock =
        Number(
            currentMedicine.stock || 0
        );

    if (stock <= 0) {

        showMessage(
            "This medicine is out of stock.",
            "error"
        );

        return;
    }

    const quantityInput =
        document.getElementById(
            "product-quantity"
        );

    let quantity =
        Number(
            quantityInput
                ? quantityInput.value
                : 1
        );

    if (
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {

        quantity = 1;
    }

    if (quantity > stock) {

        quantity = stock;

        if (quantityInput) {
            quantityInput.value =
                quantity;
        }
    }

    let cart =
        getCart();

    // ====================================
    // Find existing product
    // ====================================

    const existingIndex =
        cart.findIndex(
            function (item) {

                return (
                    String(item.id) ===
                    String(
                        currentMedicine._id
                    )
                );
            }
        );

    if (existingIndex !== -1) {

        let newQuantity =
            Number(
                cart[existingIndex]
                    .quantity || 0
            ) + quantity;

        if (newQuantity > stock) {

            newQuantity =
                stock;
        }

        cart[existingIndex]
            .quantity =
            newQuantity;

    } else {

        cart.push({

            id:
                String(
                    currentMedicine._id
                ),

            name:
                currentMedicine.name,

            price:
                Number(
                    currentMedicine.price || 0
                ),

            quantity:
                quantity,

            image:
                currentMedicine.image ||
                "",

            emoji:
                currentMedicine.emoji ||
                "💊"
        });
    }

    saveCart(cart);

    updateCartCount();

    showMessage(
        "Medicine added to cart successfully!",
        "success"
    );
}

// ========================================
// Update Cart Count
// ========================================
function updateCartCount() {

    const cart =
        getCart();

    const totalItems =
        cart.reduce(
            function (
                total,
                item
            ) {

                return (
                    total +
                    Number(
                        item.quantity || 0
                    )
                );

            },
            0
        );

    // Supports both IDs/classes
    const countElements =
        document.querySelectorAll(
            "#cart-count, .cart-count"
        );

    countElements.forEach(
        function (element) {

            element.textContent =
                totalItems;
        }
    );
}

// ========================================
// Show Message
// ========================================
function showMessage(
    message,
    type
) {

    let messageElement =
        document.getElementById(
            "product-message"
        );

    // If HTML doesn't have message box,
    // create one automatically.
    if (!messageElement) {

        messageElement =
            document.createElement(
                "div"
            );

        messageElement.id =
            "product-message";

        messageElement.style.marginTop =
            "15px";

        messageElement.style.padding =
            "12px";

        messageElement.style.borderRadius =
            "8px";

        const addButton =
            document.getElementById(
                "add-to-cart"
            );

        if (addButton) {

            addButton.parentNode
                .insertBefore(
                    messageElement,
                    addButton.nextSibling
                );
        }
    }

    messageElement.textContent =
        message;

    if (type === "success") {

        messageElement.style.color =
            "#168a3b";

        messageElement.style.background =
            "#eaf8ef";

    } else {

        messageElement.style.color =
            "#c62828";

        messageElement.style.background =
            "#fdecec";
    }

    messageElement.style.display =
        "block";

    setTimeout(
        function () {

            messageElement.style.display =
                "none";

        },
        2500
    );
}

// ========================================
// Page Load
// ========================================
document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadMedicine();

        updateCartCount();

        // IMPORTANT:
        // These IDs match YOUR HTML

        const increaseButton =
            document.getElementById(
                "increase-quantity"
            );

        if (increaseButton) {

            increaseButton.addEventListener(
                "click",
                increaseQuantity
            );
        }

        const decreaseButton =
            document.getElementById(
                "decrease-quantity"
            );

        if (decreaseButton) {

            decreaseButton.addEventListener(
                "click",
                decreaseQuantity
            );
        }

        const addButton =
            document.getElementById(
                "add-to-cart"
            );

        if (addButton) {

            addButton.addEventListener(
                "click",
                addToCart
            );
        }

    }
);
