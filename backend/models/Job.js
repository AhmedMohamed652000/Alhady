const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'Full-time'
  },
  salary: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  requirements: {
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

JobSchema.index({ order: 1 });
JobSchema.index({ active: 1 });

module.exports = mongoose.model('Job', JobSchema);
