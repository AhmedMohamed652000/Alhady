const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: ''
  },
  profileImage: {
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
TeamSchema.index({ order: 1 });
TeamSchema.index({ active: 1 });
TeamSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Team', TeamSchema);
