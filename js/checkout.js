const CHECKOUT_API = "http://localhost:5000/api";

let cart = [];


// ========================================
// LOAD CART
// ========================================

function loadCheckoutCart() {

    try {

        cart =
            JSON.parse(
                localStorage.getItem("medifastCart")
            ) || [];

    } catch (error) {

        console.error(
            "Cart Load Error:",
            error
        );

        cart = [];
    }

    return cart;
}


// ========================================
// CALCULATE TOTALS
// ========================================

function calculateCheckoutTotals() {

    const subtotal =
        cart.reduce(
            (total, item) => {

                return total +
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

            },
            0
        );


    const delivery =
        subtotal === 0 || subtotal >= 500
            ? 0
            : 40;


    const total =
        subtotal + delivery;


    return {
        subtotal,
        delivery,
        total
    };
}


// ========================================
// FORMAT PRICE
// ========================================

function formatCheckoutPrice(amount) {

    return `₹${Number(
        amount || 0
    ).toLocaleString("en-IN")}`;
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// DISPLAY ORDER SUMMARY
// ========================================

function displayCheckoutSummary() {

    const itemsElement =
        document.getElementById(
            "checkout-items"
        );


    const subtotalElement =
        document.getElementById(
            "checkout-subtotal"
        );


    const deliveryElement =
        document.getElementById(
            "checkout-delivery"
        );


    const totalElement =
        document.getElementById(
            "checkout-total"
        );


    const totals =
        calculateCheckoutTotals();


    // ITEMS

    if (itemsElement) {

        if (!cart.length) {

            itemsElement.innerHTML = `

                <div class="summary-item">

                    <span class="summary-item-name">
                        No items in cart
                    </span>

                </div>

            `;

        } else {

            itemsElement.innerHTML =
                cart.map(item => {

                    const quantity =
                        Number(
                            item.quantity || 0
                        );


                    const price =
                        Number(
                            item.price || 0
                        );


                    const itemTotal =
                        price * quantity;


                    return `

                        <div class="summary-item">

                            <div>

                                <div class="summary-item-name">
                                    ${escapeHtml(item.name)}
                                </div>

                                <div class="summary-item-qty">
                                    Qty: ${quantity}
                                </div>

                            </div>


                            <strong>
                                ${formatCheckoutPrice(itemTotal)}
                            </strong>

                        </div>

                    `;

                }).join("");
        }
    }


    // SUBTOTAL

    if (subtotalElement) {

        subtotalElement.textContent =
            formatCheckoutPrice(
                totals.subtotal
            );
    }


    // DELIVERY

    if (deliveryElement) {

        deliveryElement.textContent =
            totals.delivery === 0
                ? "FREE"
                : formatCheckoutPrice(
                    totals.delivery
                );
    }


    // TOTAL

    if (totalElement) {

        totalElement.textContent =
            formatCheckoutPrice(
                totals.total
            );
    }
}


// ========================================
// SHOW MESSAGE
// ========================================

function showCheckoutMessage(
    message,
    type = "error"
) {

    const messageElement =
        document.getElementById(
            "checkout-message"
        );


    if (!messageElement) {

        alert(message);

        return;
    }


    messageElement.textContent =
        message;


    messageElement.className =
        `checkout-message ${type}`;


    messageElement.style.display =
        "block";
}


// ========================================
// CLEAR MESSAGE
// ========================================

function clearCheckoutMessage() {

    const messageElement =
        document.getElementById(
            "checkout-message"
        );


    if (!messageElement) {
        return;
    }


    messageElement.textContent =
        "";


    messageElement.style.display =
        "none";


    messageElement.className =
        "checkout-message";
}


// ========================================
// VALIDATE FORM
// ========================================

function validateCheckoutForm() {

    const name =
        document
            .getElementById(
                "customer-name"
            )
            ?.value
            .trim();


    const phone =
        document
            .getElementById(
                "customer-phone"
            )
            ?.value
            .trim();


    const address =
        document
            .getElementById(
                "address"
            )
            ?.value
            .trim();


    const state =
        document
            .getElementById(
                "state"
            )
            ?.value;


    const city =
        document
            .getElementById(
                "city"
            )
            ?.value;


    const pincode =
        document
            .getElementById(
                "pincode"
            )
            ?.value
            .trim();


    // NAME

    if (!name) {

        showCheckoutMessage(
            "Please enter your name."
        );

        return false;
    }


    // PHONE

    if (!phone) {

        showCheckoutMessage(
            "Please enter your mobile number."
        );

        return false;
    }


    if (!/^[6-9]\d{9}$/.test(phone)) {

        showCheckoutMessage(
            "Please enter a valid 10-digit mobile number."
        );

        return false;
    }


    // ADDRESS

    if (!address) {

        showCheckoutMessage(
            "Please enter your complete address."
        );

        return false;
    }


    // STATE

    if (!state) {

        showCheckoutMessage(
            "Please select your state."
        );

        return false;
    }


    // CITY

    if (!city) {

        showCheckoutMessage(
            "Please select your city."
        );

        return false;
    }


    // PINCODE

    if (!pincode) {

        showCheckoutMessage(
            "Please enter your pincode."
        );

        return false;
    }


    if (!/^\d{6}$/.test(pincode)) {

        showCheckoutMessage(
            "Please enter a valid 6-digit pincode."
        );

        return false;
    }


    // PAYMENT

    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    if (!payment) {

        showCheckoutMessage(
            "Please select a payment method."
        );

        return false;
    }


    return true;
}


// ========================================
// PLACE ORDER
// ========================================

async function placeOrder(event) {

    event.preventDefault();


    clearCheckoutMessage();


    // Reload cart

    loadCheckoutCart();


    // Empty cart

    if (!cart.length) {

        showCheckoutMessage(
            "Your cart is empty. Please add a medicine first."
        );

        return;
    }


    // Validate

    if (!validateCheckoutForm()) {
        return;
    }


    // JWT TOKEN

    const token =
        localStorage.getItem(
            "medifastToken"
        );


    if (!token) {

        showCheckoutMessage(
            "Please login before placing your order."
        );


        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1200);


        return;
    }


    // FORM DATA

    const name =
        document
            .getElementById(
                "customer-name"
            )
            .value
            .trim();


    const phone =
        document
            .getElementById(
                "customer-phone"
            )
            .value
            .trim();


    const address =
        document
            .getElementById(
                "address"
            )
            .value
            .trim();


    const state =
        document
            .getElementById(
                "state"
            )
            .value;


    const city =
        document
            .getElementById(
                "city"
            )
            .value;


    const pincode =
        document
            .getElementById(
                "pincode"
            )
            .value
            .trim();


    const paymentElement =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    const paymentMethod =
        paymentElement.value;


    // TOTALS

    const totals =
        calculateCheckoutTotals();


    // ORDER DATA

    const orderData = {

        items: cart.map(item => ({

            id: item.id,

            name: item.name,

            price:
                Number(item.price),

            emoji:
                item.emoji || "💊",

            quantity:
                Number(item.quantity)

        })),


        customer: {

            name,

            phone,

            address,

            city,

            state,

            pincode

        },


        paymentMethod,

        subtotal:
            totals.subtotal,

        delivery:
            totals.delivery,

        total:
            totals.total
    };


    console.log(
        "MediFast Order Data:",
        orderData
    );


    // BUTTON

    const submitButton =
        document.getElementById(
            "place-order-btn"
        );


    const originalText =
        submitButton
            ? submitButton.textContent
            : "Place Order";


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Placing Order...";
    }


    // ========================================
    // API REQUEST
    // ========================================

    try {

        const response =
            await fetch(
                `${CHECKOUT_API}/orders`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(
                            orderData
                        )
                }
            );


        let data = {};


        try {

            data =
                await response.json();

        } catch (error) {

            console.warn(
                "Server response was not JSON."
            );
        }


        console.log(
            "MediFast Order Response:",
            data
        );


        // API ERROR

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to place order."
            );
        }


        // ========================================
        // SUCCESS
        // ========================================

        localStorage.removeItem(
            "medifastCart"
        );


        if (
            typeof updateCartCount ===
            "function"
        ) {

            updateCartCount();
        }


        showCheckoutMessage(
            "Order placed successfully! Redirecting to My Orders...",
            "success"
        );


        setTimeout(() => {

            window.location.href =
                "orders.html";

        }, 1000);


    } catch (error) {

        console.error(
            "Place Order Error:",
            error
        );


        showCheckoutMessage(
            error.message ||
            "Unable to place order. Please try again."
        );


        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                originalText;
        }
    }
}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // Load cart

        loadCheckoutCart();


        // Display summary

        displayCheckoutSummary();


        // Checkout form

        const checkoutForm =
            document.getElementById(
                "checkout-form"
            );


        if (checkoutForm) {

            checkoutForm.addEventListener(
                "submit",
                placeOrder
            );
        }


        // Empty cart

        if (!cart.length) {

            const submitButton =
                document.getElementById(
                    "place-order-btn"
                );


            if (submitButton) {

                submitButton.disabled =
                    true;
            }


            showCheckoutMessage(
                "Your cart is empty. Please add medicines before checkout."
            );
        }

    }
);