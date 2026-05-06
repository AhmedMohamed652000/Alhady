require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');

const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const bannersRouter = require('./routes/banners');
const servicesRouter = require('./routes/services');
const toolsRouter = require('./routes/tools');
const clientsRouter = require('./routes/clients');
const partnersRouter = require('./routes/partners');
const teamRouter = require('./routes/team');
const reviewsRouter = require('./routes/reviews');
const portfolioRouter = require('./routes/portfolio');
const projectsRouter = require('./routes/projects');
const settingsRouter = require('./routes/settings');



const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Serve static uploads
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' }
});

// Route stubs (filled in per user story)
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/banners', bannersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/tools', toolsRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/team', teamRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/settings', settingsRouter);

// Root route for health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Alhady Backend API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/alhady';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });
