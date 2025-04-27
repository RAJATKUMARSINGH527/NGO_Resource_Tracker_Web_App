const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Water', 'Medical', 'Shelter', 'Hygiene', 'Clothing', 'Education', 'Other'],
    default: 'Food'
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    default: 'units'
  },
  location: {
    type: String,
    required: true,
    enum: ['Warehouse A', 'Warehouse B', 'Storage C']
  },
  expiryDate: {
    type: Date
  },
  batchNumber: String,
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true,versionKey: false });

const InventoryItemModel = mongoose.model('InventoryItem', inventoryItemSchema);

module.exports = InventoryItemModel;
