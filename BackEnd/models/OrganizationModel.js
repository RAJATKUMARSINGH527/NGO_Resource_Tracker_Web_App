const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: String,
  website: String,
  mission: String,
}, { timestamps: true , versionKey: false });   

const OrganizationModel = mongoose.model('Organization', organizationSchema);

module.exports = OrganizationModel;