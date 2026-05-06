const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  yearsExperience: {
    type: Number,
    default: 0
  },
  projectsCompleted: {
    type: Number,
    default: 0
  },
  teamSize: {
    type: Number,
    default: 0
  },
  aboutDescription: {
    type: String,
    default: ''
  },
  heroTitle: {
    type: String,
    default: ''
  },
  heroSubtitle: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

SiteSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
