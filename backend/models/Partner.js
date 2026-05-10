const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
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
PartnerSchema.index({ order: 1 });
PartnerSchema.index({ active: 1 });
PartnerSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Partner', PartnerSchema);
