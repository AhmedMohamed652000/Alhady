const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  serviceCategory: {
    type: String,
    default: ''
  },
  homeCardImage: {
    type: String,
    default: ''
  },
  projectImage: {
    type: String,
    default: ''
  },
  header: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  projectDetails: {
    projectType: { type: String, default: '' },
    client: { type: String, default: '' },
    year: { type: String, default: '' },
    location: { type: String, default: '' },
    projectSize: { type: String, default: '' },
    projectTime: { type: String, default: '' },
    peopleWorked: { type: String, default: '' },
    projectCost: { type: String, default: '' },
    statisticsIcon: { type: String, default: '' }
  },
  projectSamples: [{
    image: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
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

module.exports = mongoose.model('Project', ProjectSchema);
