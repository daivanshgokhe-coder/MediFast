const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// ========================================
// CREATE TOKEN
// ========================================

function createToken(user) {

    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "7d"
        }
    );
}


// ========================================
// REGISTER
// ========================================

async function registerUser(
    req,
    res
) {

    try {

        const {
            name,
            email,
            phone,
            password
        } = req.body;


        if (
            !name ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "All fields are required"
            });
        }


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 6 characters"
            });
        }


        const existingUser =
            await User.findOne({
                email:
                    email.toLowerCase()
            });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message:
                    "Email already registered"
            });
        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const user =
            await User.create({

                name: name.trim(),

                email:
                    email.toLowerCase().trim(),

                phone: phone.trim(),

                password:
                    hashedPassword

            });


        const token =
            createToken(user);


        res.status(201).json({

            success: true,

            message:
                "Registration successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }

        });

    } catch (error) {

        console.error(
            "Register Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Registration failed"
        });
    }
}


// ========================================
// LOGIN
// ========================================

async function loginUser(
    req,
    res
) {

    try {

        const {
            email,
            password
        } = req.body;


        if (
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });
        }


        const user =
            await User.findOne({
                email:
                    email.toLowerCase().trim()
            });


        if (!user) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }


        const token =
            createToken(user);


        res.json({

            success: true,

            message:
                "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }

        });

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Login failed"
        });
    }
}


// ========================================
// GET CURRENT USER
// ========================================

async function getCurrentUser(
    req,
    res
) {

    res.json({

        success: true,

        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role
        }

    });
}


module.exports = {

    registerUser,
    loginUser,
    getCurrentUser

};