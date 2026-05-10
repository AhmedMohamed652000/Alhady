const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  sliderImage: {
    type: String,
    default: ''
  },
  cardImage: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  link: {
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for performance
ServiceSchema.index({ order: 1 });
ServiceSchema.index({ active: 1 });
ServiceSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Service', ServiceSchema);
