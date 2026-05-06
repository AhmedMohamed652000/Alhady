const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/alhady';

async function createAdmin() {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.log('Usage: node create-admin.js <email> <password>');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB...');

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log(`Admin with email ${email} already exists.`);
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Admin.create({
            email,
            passwordHash: hashedPassword
        });

        console.log(`Admin created successfully: ${email}`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to create admin:', error.message);
        process.exit(1);
    }
}

createAdmin();
