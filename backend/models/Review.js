const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  image: {
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
ReviewSchema.index({ order: 1 });
ReviewSchema.index({ active: 1 });
ReviewSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Review', ReviewSchema);
