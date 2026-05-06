const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Models
const Admin = require('./models/Admin');
const Banner = require('./models/Banner');
const Service = require('./models/Service');
const Tool = require('./models/Tool');
const Client = require('./models/Client');
const Partner = require('./models/Partner');
const Team = require('./models/Team');
const Review = require('./models/Review');
const Portfolio = require('./models/Portfolio');
const Project = require('./models/Project');
const SiteSettings = require('./models/SiteSettings');

// Data
const seedData = require('./data/seed-data');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/alhady';

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Seed Admin
        const adminEmail = 'admin@alhady.com';
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.findOneAndUpdate(
            { email: adminEmail },
            { 
                email: adminEmail, 
                passwordHash: hashedPassword 
            },
            { upsert: true, new: true }
        );
        console.log('Admin seeded.');

        // 2. Seed Banners (by page)
        for (const item of seedData.banners) {
            await Banner.findOneAndUpdate({ page: item.page }, item, { upsert: true });
        }
        console.log(`Seeded ${seedData.banners.length} banners.`);

        // 3. Seed Services (by title)
        for (const item of seedData.services) {
            await Service.findOneAndUpdate({ title: item.title }, item, { upsert: true });
        }
        console.log(`Seeded ${seedData.services.length} services.`);

        // 4. Seed Tools (by title)
        for (const item of seedData.tools) {
            await Tool.findOneAndUpdate({ title: item.title }, item, { upsert: true });
        }
        console.log(`Seeded ${seedData.tools.length} tools.`);

        // 5. Seed Clients (by title)
        for (const item of seedData.clients) {
            await Client.findOneAndUpdate({ title: item.title }, item, { upsert: true });
        }
        console.log(`Seeded ${seedData.clients.length} clients.`);

        // 6. Seed Partners (by title)
        for (const item of seedData.partners) {
            await Partner.findOneAndUpdate({ title: item.title }, item, { upsert: true });
        }
        console.log(`Seeded ${seedData.partners.length} partners.`);

        // 7. Seed Team (by name)
        for (const item of seedData.team) {
            await Team.findOneAndUpdate({ name: item.name }, item, { upsert: true });
        }
        console.log(`Seeded ${seedData.team.length} team members.`);

        // 8. Seed Reviews (by name and jobTitle)
        for (const item of seedData.reviews) {
            await Review.findOneAndUpdate({ name: item.name, jobTitle: item.jobTitle }, item, { upsert: true });
        }
        console.log(`Seeded ${seedData.reviews.length} reviews.`);

        // 9. Seed Portfolio (by title)
        for (const item of seedData.portfolio) {
            await Portfolio.findOneAndUpdate({ title: item.title }, item, { upsert: true });
        }
        console.log(`Seeded ${seedData.portfolio.length} portfolio items.`);

        // 10. Seed Projects (by title)
        for (const item of seedData.projects) {
            await Project.findOneAndUpdate({ title: item.title }, item, { upsert: true });
        }
        console.log(`Seeded ${seedData.projects.length} projects.`);

        // 11. Seed SiteSettings (singleton)
        await SiteSettings.updateOne({}, seedData.settings, { upsert: true });
        console.log('Site settings seeded.');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
