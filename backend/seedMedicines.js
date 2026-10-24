const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Medicine = require("./models/Medicine");

dotenv.config();

const medicines = [
    {
        name: "Paracetamol 500mg",
        category: "medicine",
        price: 25,
        emoji: "💊",
        description: "For fever and mild to moderate pain relief.",
        stock: 100
    },
    {
        name: "Vitamin C Tablets",
        category: "vitamins",
        price: 120,
        emoji: "🍊",
        description: "Vitamin C supplement for daily nutritional support.",
        stock: 80
    },
    {
        name: "Multivitamin Tablets",
        category: "vitamins",
        price: 249,
        emoji: "💊",
        description: "Daily multivitamin supplement.",
        stock: 60
    },
    {
        name: "Digital Thermometer",
        category: "first-aid",
        price: 199,
        emoji: "🌡️",
        description: "Digital thermometer for quick temperature measurement.",
        stock: 50
    },
    {
        name: "Antiseptic Liquid",
        category: "first-aid",
        price: 95,
        emoji: "🧴",
        description: "Antiseptic liquid for basic wound cleaning and hygiene.",
        stock: 70
    },
    {
        name: "Hand Sanitizer",
        category: "personal-care",
        price: 75,
        emoji: "🧴",
        description: "Hand sanitizer for everyday hand hygiene.",
        stock: 100
    },
    {
        name: "Face Mask Pack",
        category: "personal-care",
        price: 99,
        emoji: "😷",
        description: "Pack of protective face masks.",
        stock: 120
    },
    {
        name: "First Aid Kit",
        category: "first-aid",
        price: 399,
        emoji: "🩹",
        description: "Basic first aid kit for home and travel.",
        stock: 40
    },
    {
        name: "Cough Syrup",
        category: "medicine",
        price: 145,
        emoji: "🍯",
        description: "Cough relief syrup.",
        stock: 55
    },
    {
        name: "Pain Relief Gel",
        category: "medicine",
        price: 110,
        emoji: "🧴",
        description: "Topical gel for temporary muscle and joint pain relief.",
        stock: 65
    },
    {
        name: "Calcium Tablets",
        category: "vitamins",
        price: 180,
        emoji: "💊",
        description: "Calcium supplement for daily nutritional support.",
        stock: 75
    },
    {
        name: "Digital BP Monitor",
        category: "first-aid",
        price: 1299,
        emoji: "🩺",
        description: "Digital blood pressure monitor for home use.",
        stock: 25
    }
];

async function seedMedicines() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected.");

        await Medicine.deleteMany({});

        await Medicine.insertMany(medicines);

        console.log("12 medicines added successfully.");

        await mongoose.connection.close();

        console.log("Database connection closed.");
    } catch (error) {
        console.error("Seed Error:", error);
        process.exit(1);
    }
}

seedMedicines();