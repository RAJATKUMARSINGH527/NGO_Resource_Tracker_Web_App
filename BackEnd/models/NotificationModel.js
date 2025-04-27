const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'error', 'success'],
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  relatedEntity: {
    id: mongoose.Schema.Types.ObjectId,
    model: String // Example: "Organization", "User", "Event"
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Allows flexible key-value extra data
    default: {}
  }
}, { timestamps: true, versionKey: false });

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
