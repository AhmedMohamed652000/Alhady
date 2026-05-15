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
const Job = require('./models/Job');

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

        // Helper to seed array data
        const seedCollection = async (data, model, queryKey, label) => {
            if (data && Array.isArray(data)) {
                for (const item of data) {
                    const query = {};
                    if (Array.isArray(queryKey)) {
                        queryKey.forEach(k => query[k] = item[k]);
                    } else {
                        query[queryKey] = item[queryKey];
                    }
                    await model.findOneAndUpdate(query, item, { upsert: true });
                }
                console.log(`Seeded ${data.length} ${label}.`);
            }
        };

        await seedCollection(seedData.banners, Banner, 'page', 'banners');
        await seedCollection(seedData.services, Service, 'title', 'services');
        await seedCollection(seedData.tools, Tool, 'title', 'tools');
        await seedCollection(seedData.clients, Client, 'title', 'clients');
        await seedCollection(seedData.partners, Partner, 'title', 'partners');
        await seedCollection(seedData.team, Team, 'name', 'team members');
        await seedCollection(seedData.reviews, Review, ['name', 'jobTitle'], 'reviews');
        await seedCollection(seedData.portfolio, Portfolio, 'title', 'portfolio items');
        await seedCollection(seedData.projects, Project, 'title', 'projects');
        await seedCollection(seedData.jobs, Job, 'title', 'jobs');

        // Seed SiteSettings (singleton)
        if (seedData.settings) {
            await SiteSettings.updateOne({}, seedData.settings, { upsert: true });
            console.log('Site settings seeded.');
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
