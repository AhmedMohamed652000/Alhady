const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  serviceCategory: {
    type: String,
    default: ''
  },
  cardImage: {
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
PortfolioSchema.index({ order: 1 });
PortfolioSchema.index({ active: 1 });
PortfolioSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
