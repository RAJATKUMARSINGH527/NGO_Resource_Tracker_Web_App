const express = require('express');
const NotificationRouter = express.Router();
const NotificationModel = require('../models/NotificationModel'); 
const { verifyToken } = require('../middleware/validation');

// CREATE a new notification
NotificationRouter.post('/',verifyToken, async (req, res) => {
  try {
    const {
      title, message, type, priority,
      recipient, relatedEntity, metadata
    } = req.body;

    console.log('Creating a new notification with the following data:', req.body);

    const newNotification = new NotificationModel({
      title,
      message,
      type,
      priority,
      recipient,
      relatedEntity,
      metadata
    });

    const savedNotification = await newNotification.save();
    console.log('Notification created successfully:', savedNotification);
    res.status(201).json(savedNotification);
  } catch (error) {
    console.error('Error creating notification:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// GET all notifications
NotificationRouter.get('/',verifyToken, async (req, res) => {
  try {
    console.log('Fetching all notifications');
    const notifications = await NotificationModel.find();
    console.log('Fetched notifications:', notifications);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET a single notification by ID
NotificationRouter.get('/:id',verifyToken, async (req, res) => {
  try {
    console.log(`Fetching notification with ID: ${req.params.id}`);
    const notification = await NotificationModel.findById(req.params.id);
    if (!notification) {
      console.log('Notification not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Notification not found' });
    }
    console.log('Notification found:', notification);
    res.status(200).json(notification);
  } catch (error) {
    console.error(`Error fetching notification with ID: ${req.params.id}`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a notification by ID (e.g., mark as read)
NotificationRouter.put('/:id', verifyToken,async (req, res) => {
  try {
    console.log(`Updating notification with ID: ${req.params.id} with data:`, req.body);
    const updatedNotification = await NotificationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedNotification) {
      console.log('Notification not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Notification not found' });
    }
    console.log('Notification updated successfully:', updatedNotification);
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error(`Error updating notification with ID: ${req.params.id}`, error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE a notification by ID
NotificationRouter.delete('/:id', verifyToken,async (req, res) => {
  try {
    console.log(`Deleting notification with ID: ${req.params.id}`);
    const deletedNotification = await NotificationModel.findByIdAndDelete(req.params.id);
    if (!deletedNotification) {
      console.log('Notification not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Notification not found' });
    }
    console.log('Notification deleted successfully');
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error(`Error deleting notification with ID: ${req.params.id}`, error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = NotificationRouter;
