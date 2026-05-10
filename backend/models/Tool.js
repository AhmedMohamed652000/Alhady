const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
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
ToolSchema.index({ order: 1 });
ToolSchema.index({ active: 1 });
ToolSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Tool', ToolSchema);
