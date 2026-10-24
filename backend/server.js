
// ========================================
// MediFast Backend Server
// Location: backend/server.js
// ========================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ========================================
// UPLOADS
// ========================================

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);


// ========================================
// API ROUTES
// ========================================

const authRoutes =
    require("./routes/auth");

const medicineRoutes =
    require("./routes/medicines");

const orderRoutes =
    require("./routes/orders");

const prescriptionRoutes =
    require("./routes/prescriptions");


app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/medicines",
    medicineRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/prescriptions",
    prescriptionRoutes
);


// ========================================
// API HEALTH CHECK
// ========================================

app.get(
    "/api",
    function (req, res) {

        res.json({
            success: true,
            message:
                "MediFast API is running successfully"
        });

    }
);


// ========================================
// SERVE FRONTEND
// ========================================

// MediFast folder is one level above backend
const frontendPath =
    path.join(
        __dirname,
        ".."
    );


// Serve HTML, CSS, JS, images etc.
app.use(
    express.static(
        frontendPath
    )
);


// ========================================
// ROOT PAGE
// ========================================

app.get(
    "/",
    function (req, res) {

        res.sendFile(
            path.join(
                frontendPath,
                "index.html"
            )
        );

    }
);


// ========================================
// MONGODB CONNECTION
// ========================================

mongoose
    .connect(
        process.env.MONGO_URI
    )
    .then(
        function () {

            console.log(
                "MongoDB Connected Successfully"
            );

        }
    )
    .catch(
        function (error) {

            console.error(
                "MongoDB Connection Error:",
                error.message
            );

        }
    );


// ========================================
// START SERVER
// ========================================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    function () {

        console.log(
            `MediFast server running on http://localhost:${PORT}`
        );

        console.log(
            "Frontend and Backend are running together."
        );

    }
);
