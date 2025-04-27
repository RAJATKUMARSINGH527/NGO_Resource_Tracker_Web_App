const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['Cash', 'Item', 'Service'],
    default: 'Cash'
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryItem'
    },
    quantity: Number,
    value: Number
  }],
  description: String,
  acknowledgementSent: {
    type: Boolean,
    default: false
  }
});

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Individual', 'Organization', 'Corporate', 'Foundation', 'Government'],
    default: 'Individual'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String,
    position: String
  },
  donations: [donationSchema],
  totalDonated: {
    type: Number,
    default: 0
  },
  notes: String,
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  }
}, { timestamps: true, versionKey: false });

const DonorModel = mongoose.model('Donor', donorSchema);

module.exports = DonorModel;