const mongoose = require('mongoose');

const logisticsSchema = new mongoose.Schema({
  shipmentId: {
    type: String,
    required: true,
    unique: true
  },
  destination: {
    name: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  departureDate: Date,
  deliveryDate: Date,
  transportMethod: {
    type: String,
    enum: ['Road', 'Air', 'Sea', 'Rail', 'Other'],
    default: 'Road'
  },
  carrier: {
    name: String,
    contactPerson: String,
    phone: String,
    trackingNumber: String
  },
  notes: String,
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true ,versionKey: false });

const LogisticsModel = mongoose.model('Logistics', logisticsSchema);
module.exports = LogisticsModel;