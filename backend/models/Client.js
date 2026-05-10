const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  icon: {
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
ClientSchema.index({ order: 1 });
ClientSchema.index({ active: 1 });
ClientSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Client', ClientSchema);
