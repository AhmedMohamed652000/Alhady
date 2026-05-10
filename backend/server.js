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
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173', 'https://alhady.vercel.app'];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    return callback(null, true); // Allow all origins for now to fix CORS
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginEmbedderPolicy: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Welcome route
app.get('/api', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to Alhady API',
    version: '1.0.0',
    status: 'Running'
  });
});

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
  res.json({ 
    success: true, 
    message: 'Welcome to Alhady Backend Service',
    api_status: 'Online',
    documentation: '/api'
  });
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

module.exports = app;
