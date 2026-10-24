
// ========================================
// MediFast - Authentication
// Location: js/auth.js
// ========================================

const API_BASE_URL = "http://127.0.0.1:5000/api";


// ========================================
// API REQUEST HELPER
// ========================================

async function authApiRequest(endpoint, options = {}) {

    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,

                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {})
                }
            }
        );

        let data = {};

        try {
            data = await response.json();
        } catch (error) {
            data = {};
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Login request failed."
            );
        }

        return data;

    } catch (error) {

        console.error("API Error:", error);

        if (
            error instanceof TypeError ||
            error.message === "Failed to fetch"
        ) {
            throw new Error(
                "Unable to connect to MediFast server. Please make sure the backend is running on port 5000."
            );
        }

        throw error;
    }
}


// ========================================
// SHOW MESSAGE
// ========================================

function showAuthMessage(
    message,
    type = "error"
) {

    const messageElement =
        document.getElementById("auth-message");

    if (!messageElement) {
        alert(message);
        return;
    }

    messageElement.textContent = message;

    messageElement.className =
        `message ${type}`;

    messageElement.style.display = "block";
}


// ========================================
// SAVE LOGIN DATA
// ========================================

function saveLoginData(data) {

    const token =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        "";

    const user =
        data.user ||
        data.data?.user ||
        null;

    if (token) {
        localStorage.setItem(
            "medifastToken",
            token
        );
    }

    if (user) {
        localStorage.setItem(
            "medifastUser",
            JSON.stringify(user)
        );
    }
}


// ========================================
// CHECK LOGIN
// ========================================

function isLoggedIn() {

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
// LOGIN
// ========================================

async function loginUser(event) {

    event.preventDefault();

    const emailElement =
        document.getElementById(
            "login-email"
        );

    const passwordElement =
        document.getElementById(
            "login-password"
        );

    if (!emailElement || !passwordElement) {
        return;
    }

    const email =
        emailElement.value
            .trim()
            .toLowerCase();

    const password =
        passwordElement.value;

    if (!email || !password) {

        showAuthMessage(
            "Please enter email and password."
        );

        return;
    }

    const submitButton =
        document.getElementById(
            "login-submit"
        );

    try {

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent =
                "Logging in...";
        }

        const data =
            await authApiRequest(
                "/auth/login",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

        // Save login session
        saveLoginData(data);

        // Confirm session was saved
        if (!isLoggedIn()) {

            throw new Error(
                "Login successful, but login session could not be saved."
            );
        }

        showAuthMessage(
            data.message ||
            "Login successful. Redirecting...",
            "success"
        );

        // Go to medicines page
        setTimeout(
            function () {

                window.location.replace(
                    "products.html"
                );

            },
            500
        );

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        showAuthMessage(
            error.message ||
            "Unable to login."
        );

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Login";
        }
    }
}


// ========================================
// REGISTER
// ========================================

async function registerUser(event) {

    event.preventDefault();

    const nameElement =
        document.getElementById(
            "register-name"
        );

    const emailElement =
        document.getElementById(
            "register-email"
        );

    const phoneElement =
        document.getElementById(
            "register-phone"
        );

    const passwordElement =
        document.getElementById(
            "register-password"
        );

    const confirmPasswordElement =
        document.getElementById(
            "register-confirm-password"
        );

    if (
        !nameElement ||
        !emailElement ||
        !phoneElement ||
        !passwordElement ||
        !confirmPasswordElement
    ) {
        return;
    }

    const name =
        nameElement.value.trim();

    const email =
        emailElement.value
            .trim()
            .toLowerCase();

    const phone =
        phoneElement.value.trim();

    const password =
        passwordElement.value;

    const confirmPassword =
        confirmPasswordElement.value;

    const terms =
        document.getElementById(
            "register-terms"
        );

    if (
        !name ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
    ) {

        showAuthMessage(
            "Please fill all required fields."
        );

        return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {

        showAuthMessage(
            "Please enter a valid 10-digit Indian mobile number."
        );

        return;
    }

    if (password.length < 6) {

        showAuthMessage(
            "Password must contain at least 6 characters."
        );

        return;
    }

    if (password !== confirmPassword) {

        showAuthMessage(
            "Passwords do not match."
        );

        return;
    }

    if (terms && !terms.checked) {

        showAuthMessage(
            "Please accept the terms and conditions."
        );

        return;
    }

    const registerButton =
        document.querySelector(
            '#register-form button[type="submit"]'
        );

    try {

        if (registerButton) {
            registerButton.disabled = true;
            registerButton.textContent =
                "Creating Account...";
        }

        const data =
            await authApiRequest(
                "/auth/register",
                {
                    method: "POST",

                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        password
                    })
                }
            );

        saveLoginData(data);

        showAuthMessage(
            data.message ||
            "Registration successful. Redirecting...",
            "success"
        );

        setTimeout(
            function () {

                window.location.replace(
                    "products.html"
                );

            },
            500
        );

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        showAuthMessage(
            error.message ||
            "Unable to register."
        );

        if (registerButton) {
            registerButton.disabled = false;
            registerButton.textContent =
                "Register";
        }
    }
}


// ========================================
// LOGOUT
// ========================================

function logoutAuthUser() {

    // Login data is removed ONLY
    // when user clicks Logout.

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
// GET CURRENT USER
// ========================================

function getAuthUser() {

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

        return null;
    }
}


// ========================================
// GET TOKEN
// ========================================

function getAuthToken() {

    return localStorage.getItem(
        "medifastToken"
    );
}


// ========================================
// AUTH PAGE INITIALIZATION
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loginForm =
            document.getElementById(
                "login-form"
            );

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginUser
            );
        }


        const registerForm =
            document.getElementById(
                "register-form"
            );

        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                registerUser
            );
        }

    }
);
