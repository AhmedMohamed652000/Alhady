const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    unique: true,
    enum: ['home', 'about', 'service', 'project', 'portfolio', 'team', 'contact', 'faq']
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  backgroundImage: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

BannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for performance
BannerSchema.index({ page: 1 });
BannerSchema.index({ order: 1 });
BannerSchema.index({ active: 1 });
BannerSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Banner', BannerSchema);
