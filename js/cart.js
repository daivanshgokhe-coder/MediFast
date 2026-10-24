// ========================================
// MediFast - Cart
// ========================================


// ========================================
// GET CART
// ========================================

function getCartItems() {

    try {

        return JSON.parse(
            localStorage.getItem("medifastCart")
        ) || [];

    } catch (error) {

        console.error(
            "Cart data error:",
            error
        );

        return [];

    }

}


// ========================================
// SAVE CART
// ========================================

function saveCartItems(cart) {

    localStorage.setItem(
        "medifastCart",
        JSON.stringify(cart)
    );


    if (
        typeof updateCartCount ===
        "function"
    ) {

        updateCartCount();

    }

}


// ========================================
// FORMAT PRICE
// ========================================

function cartFormatPrice(price) {

    return "₹" +
        Number(price || 0)
            .toLocaleString("en-IN");

}


// ========================================
// DISPLAY CART
// ========================================

function displayCart() {

    const cartItemsContainer =
        document.getElementById(
            "cart-items"
        );

    const emptyCart =
        document.getElementById(
            "empty-cart"
        );

    const cartLayout =
        document.getElementById(
            "cart-layout"
        );


    if (!cartItemsContainer) {

        return;

    }


    const cart =
        getCartItems();


    // ========================================
    // EMPTY CART
    // ========================================

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = "";


        if (emptyCart) {

            emptyCart.style.display =
                "block";

        }


        if (cartLayout) {

            cartLayout.style.display =
                "none";

        }


        updateCartSummary([]);

        return;

    }


    // ========================================
    // SHOW CART
    // ========================================

    if (emptyCart) {

        emptyCart.style.display =
            "none";

    }


    if (cartLayout) {

        cartLayout.style.display =
            "grid";

    }


    // ========================================
    // DISPLAY ITEMS
    // ========================================

    cartItemsContainer.innerHTML =
        cart.map(
            function (item, index) {

                const quantity =
                    Number(item.quantity) || 1;

                const price =
                    Number(item.price) || 0;

                const itemTotal =
                    price * quantity;


                // ========================================
                // PRODUCT IMAGE
                // ========================================

                const productImage =
                    item.image
                        ? `
                            <img
                                src="images/products/${item.image}"
                                alt="${item.name || "Medicine"}"
                                class="cart-product-photo"
                                onerror="
                                    this.style.display='none';
                                    this.parentElement.classList.add('image-error');
                                "
                            >
                          `
                        : `
                            <div class="image-placeholder">
                                💊
                            </div>
                          `;


                return `

                    <div class="cart-item">


                        <!-- IMAGE -->

                        <div class="cart-item-image">

                            ${productImage}

                        </div>


                        <!-- INFORMATION -->

                        <div class="cart-item-info">

                            <div class="cart-item-category">
                                Healthcare Product
                            </div>

                            <h3>
                                ${item.name || "Medicine"}
                            </h3>

                            <div class="cart-item-price">

                                ${cartFormatPrice(price)}
                                each

                            </div>

                        </div>


                        <!-- ACTIONS -->

                        <div class="cart-item-actions">


                            <div class="cart-item-total">

                                ${cartFormatPrice(itemTotal)}

                            </div>


                            <div class="quantity-control">


                                <button
                                    type="button"
                                    class="quantity-btn"
                                    onclick="decreaseQuantity(${index})">

                                    −

                                </button>


                                <span
                                    class="quantity-value">

                                    ${quantity}

                                </span>


                                <button
                                    type="button"
                                    class="quantity-btn"
                                    onclick="increaseQuantity(${index})">

                                    +

                                </button>


                            </div>


                            <button
                                type="button"
                                class="remove-btn"
                                onclick="removeFromCart(${index})">

                                Remove

                            </button>


                        </div>

                    </div>

                `;

            }
        ).join("");


    // ========================================
    // UPDATE SUMMARY
    // ========================================

    updateCartSummary(cart);

}


// ========================================
// INCREASE QUANTITY
// ========================================

function increaseQuantity(index) {

    const cart =
        getCartItems();


    if (!cart[index]) {

        return;

    }


    cart[index].quantity =
        Number(cart[index].quantity || 0) + 1;


    saveCartItems(cart);


    displayCart();

}


// ========================================
// DECREASE QUANTITY
// ========================================

function decreaseQuantity(index) {

    const cart =
        getCartItems();


    if (!cart[index]) {

        return;

    }


    const currentQuantity =
        Number(
            cart[index].quantity
        ) || 1;


    if (currentQuantity <= 1) {

        removeFromCart(index);

        return;

    }


    cart[index].quantity =
        currentQuantity - 1;


    saveCartItems(cart);


    displayCart();

}


// ========================================
// REMOVE ITEM
// ========================================

function removeFromCart(index) {

    const cart =
        getCartItems();


    if (!cart[index]) {

        return;

    }


    const itemName =
        cart[index].name;


    const shouldRemove =
        confirm(
            "Remove " +
            itemName +
            " from your cart?"
        );


    if (!shouldRemove) {

        return;

    }


    cart.splice(index, 1);


    saveCartItems(cart);


    displayCart();

}


// ========================================
// UPDATE SUMMARY
// ========================================

function updateCartSummary(cart) {

    const subtotalElement =
        document.getElementById(
            "cart-subtotal"
        );


    const deliveryElement =
        document.getElementById(
            "cart-delivery"
        );


    const totalElement =
        document.getElementById(
            "cart-total"
        );


    const itemCountElement =
        document.getElementById(
            "cart-item-count"
        );


    const deliveryMessage =
        document.getElementById(
            "delivery-message"
        );


    // ========================================
    // SUBTOTAL
    // ========================================

    let subtotal = 0;

    let totalItems = 0;


    cart.forEach(
        function (item) {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 0;


            subtotal +=
                price * quantity;


            totalItems +=
                quantity;

        }
    );


    // ========================================
    // DELIVERY
    // ========================================

    let delivery = 0;


    if (subtotal === 0) {

        delivery = 0;

    } else if (subtotal >= 500) {

        delivery = 0;

    } else {

        delivery = 40;

    }


    // ========================================
    // TOTAL
    // ========================================

    const total =
        subtotal + delivery;


    // ========================================
    // DISPLAY
    // ========================================

    if (subtotalElement) {

        subtotalElement.textContent =
            cartFormatPrice(subtotal);

    }


    if (deliveryElement) {

        if (
            delivery === 0 &&
            subtotal >= 500
        ) {

            deliveryElement.textContent =
                "FREE";

        } else {

            deliveryElement.textContent =
                cartFormatPrice(delivery);

        }

    }


    if (totalElement) {

        totalElement.textContent =
            cartFormatPrice(total);

    }


    if (itemCountElement) {

        itemCountElement.textContent =
            totalItems +
            (
                totalItems === 1
                    ? " item"
                    : " items"
            );

    }


    // ========================================
    // DELIVERY MESSAGE
    // ========================================

    if (deliveryMessage) {

        if (subtotal === 0) {

            deliveryMessage.textContent =
                "Add products to your cart.";

        } else if (subtotal >= 500) {

            deliveryMessage.textContent =
                "🎉 You got FREE delivery!";

        } else {

            const remaining =
                500 - subtotal;


            deliveryMessage.textContent =
                "Add " +
                cartFormatPrice(remaining) +
                " more to get FREE delivery.";

        }

    }

}


// ========================================
// PROCEED TO CHECKOUT
// ========================================

function proceedToCheckout(event) {

    const cart =
        getCartItems();


    if (cart.length === 0) {

        if (event) {

            event.preventDefault();

        }


        alert(
            "Your cart is empty."
        );


        return false;

    }


    return true;

}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayCart();


        // ========================================
        // UPDATE HEADER CART COUNT
        // ========================================

        if (
            typeof updateCartCount ===
            "function"
        ) {

            updateCartCount();

        }


        // ========================================
        // CHECKOUT VALIDATION
        // ========================================

        const checkoutButton =
            document.getElementById(
                "checkout-btn"
            );


        if (checkoutButton) {

            checkoutButton.addEventListener(
                "click",
                function (event) {

                    proceedToCheckout(event);

                }
            );

        }

    }
);