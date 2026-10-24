require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected.");

        const adminEmail = "admin@medifast.com";
        const adminPassword = "Admin@123";

        const hashedPassword =
            await bcrypt.hash(adminPassword, 10);

        const existingAdmin = await User.findOne({
            email: adminEmail
        });

        if (existingAdmin) {

            existingAdmin.name = "MediFast Admin";
            existingAdmin.phone = "9999999999";
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "admin";

            await existingAdmin.save();

            console.log("Admin updated successfully.");

        } else {

            await User.create({
                name: "MediFast Admin",
                email: adminEmail,
                phone: "9999999999",
                password: hashedPassword,
                role: "admin"
            });

            console.log("Admin created successfully.");
        }

        console.log("Email: admin@medifast.com");
        console.log("Password: Admin@123");

        await mongoose.connection.close();

    } catch (error) {

        console.error(
            "Admin seed error:",
            error
        );

        process.exit(1);
    }
}

seedAdmin();