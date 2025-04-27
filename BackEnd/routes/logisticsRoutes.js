const express = require('express');
const LogisticsRouter = express.Router();
const LogisticsModel = require('../models/LogisticsModel');
const InventoryItemModel = require('../models/InventoryItemModel');
const mongoose = require('mongoose');
const { verifyToken } = require('../middleware/validation');

// Generate unique shipment ID
const generateShipmentId = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const prefix = `SH${year}${month}`;

  console.log(`Generating shipment ID with prefix: ${prefix}`);

  // Find the highest existing shipment ID with this prefix
  const highestShipment = await LogisticsModel.findOne({
    shipmentId: { $regex: `^${prefix}` }
  }).sort({ shipmentId: -1 });

  let sequence = 1;
  if (highestShipment) {
    const currentSequence = parseInt(highestShipment.shipmentId.substr(-4));
    sequence = currentSequence + 1;
  }

  const shipmentId = `${prefix}${String(sequence).padStart(4, '0')}`;
  console.log(`Generated shipment ID: ${shipmentId}`);
  return shipmentId;
};

// Get all logistics
LogisticsRouter.get('/',verifyToken, async (req, res) => {
  try {
    const { status, date, search } = req.query;
    let query = { organization: req.user.organization };

    console.log('Received query:', req.query);

    // Apply filters if provided
    if (status && status !== 'All Status') {
      query.status = status;
    }

    if (date) {
      console.log(`Filtering by date: ${date}`);
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      if (date === 'Today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        query.scheduledDate = { $gte: today, $lt: tomorrow };
      } else if (date === 'This Week') {
        const today = new Date();
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
        firstDay.setHours(0, 0, 0, 0);
        const lastDay = new Date(firstDay);
        lastDay.setDate(lastDay.getDate() + 7);
        query.scheduledDate = { $gte: firstDay, $lt: lastDay };
      } else if (date === 'This Month') {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        lastDay.setHours(23, 59, 59, 999);
        query.scheduledDate = { $gte: firstDay, $lte: lastDay };
      }
    }

    if (search) {
      console.log(`Searching by: ${search}`);
      query.$or = [
        { shipmentId: { $regex: search, $options: 'i' } },
        { 'destination.name': { $regex: search, $options: 'i' } }
      ];
    }

    const logistics = await LogisticsModel.find(query)
      .populate('items.item', 'name category')
      .sort({ scheduledDate: 1 });
    
    console.log(`Found logistics: ${logistics.length} records`);
    res.json(logistics);
  } catch (err) {
    console.error('Get logistics error:', err.message);
    res.status(500).send('Server error');
  }
});

// Get logistics by ID
LogisticsRouter.get('/:id',verifyToken, async (req, res) => {
  try {
    const logistics = await LogisticsModel.findById(req.params.id)
      .populate('items.item', 'name category quantity unit location')
      .populate('createdBy', 'name email');

    if (!logistics) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Check if user belongs to the same organization
    if (logistics.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this shipment' });
    }

    res.json(logistics);
  } catch (err) {
    console.error('Get logistics error:', err.message);
    res.status(500).send('Server error');
  }
});

// Post new shipment
LogisticsRouter.post('/', verifyToken,async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { destination, items, scheduledDate, transportMethod, carrier, notes } = req.body;
    console.log('Creating new shipment with data:', req.body);

    // Generate shipment ID
    const shipmentId = await generateShipmentId();
    console.log(`Generated shipment ID: ${shipmentId}`);

    // Create new shipment
    const newShipment = new LogisticsModel({
      shipmentId,
      destination,
      items,
      scheduledDate,
      transportMethod: transportMethod || 'Road',
      carrier,
      notes,
      organization: req.user.organization,
      createdBy: req.user.id
    });

    // Reserve inventory items
    for (const item of items) {
      const inventoryItem = await InventoryItemModel.findById(item.item).session(session);
      
      if (!inventoryItem) {
        throw new Error(`Inventory item ${item.item} not found`);
      }

      console.log(`Reserving inventory for item: ${item.item}, quantity: ${item.quantity}`);
      
      if (inventoryItem.quantity < item.quantity) {
        throw new Error(`Insufficient quantity for item ${inventoryItem.name}`);
      }

      inventoryItem.quantity -= item.quantity;
      await inventoryItem.save({ session });
    }

    await newShipment.save({ session });
    await session.commitTransaction();

    console.log('Shipment created successfully');
    res.status(201).json(newShipment);
  } catch (err) {
    await session.abortTransaction();
    console.error('Create shipment error:', err.message);
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

// Update shipment status
LogisticsRouter.put('/:id/status',verifyToken, async (req, res) => {
  try {
    const { status, departureDate, deliveryDate } = req.body;
    console.log(`Updating shipment status for ID: ${req.params.id} with status: ${status}`);

    const shipment = await LogisticsModel.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Check if user belongs to the same organization
    if (shipment.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this shipment' });
    }

    // Update status
    shipment.status = status || shipment.status;
    console.log(`Updated status to: ${shipment.status}`);

    // Update dates based on status
    if (status === 'In Transit' && !shipment.departureDate) {
      shipment.departureDate = departureDate || new Date();
    }

    if (status === 'Delivered' && !shipment.deliveryDate) {
      shipment.deliveryDate = deliveryDate || new Date();
    }

    // Handle cancelled shipments
    if (status === 'Cancelled' && shipment.status !== 'Cancelled') {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        console.log('Handling cancelled shipment');
        for (const item of shipment.items) {
          const inventoryItem = await InventoryItemModel.findById(item.item).session(session);
          
          if (inventoryItem) {
            inventoryItem.quantity += item.quantity;
            await inventoryItem.save({ session });
            console.log(`Returned ${item.quantity} of item ${inventoryItem.name} to inventory`);
          }
        }

        await shipment.save({ session });
        await session.commitTransaction();
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        session.endSession();
      }
    } else {
      await shipment.save();
    }

    console.log('Shipment status updated');
    res.json(shipment);
  } catch (err) {
    console.error('Update shipment status error:', err.message);
    res.status(500).send('Server error');
  }
});

// Update shipment details
LogisticsRouter.put('/:id', verifyToken,async (req, res) => {
  try {
    const { destination, carrier, transportMethod, notes, scheduledDate } = req.body;
    console.log(`Updating shipment details for ID: ${req.params.id}`);

    const shipment = await LogisticsModel.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Check if user belongs to the same organization
    if (shipment.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this shipment' });
    }

    // Can only update if not delivered or cancelled
    if (['Delivered', 'Cancelled'].includes(shipment.status)) {
      return res.status(400).json({ message: 'Cannot update a delivered or cancelled shipment' });
    }

    // Update fields
    if (destination) shipment.destination = destination;
    if (carrier) shipment.carrier = carrier;
    if (transportMethod) shipment.transportMethod = transportMethod;
    if (notes) shipment.notes = notes;
    if (scheduledDate) shipment.scheduledDate = scheduledDate;

    await shipment.save();
    res.json(shipment);
  } catch (err) {
    console.error('Update shipment error:', err.message);
    res.status(500).send('Server error');
  }
});

// Delete shipment
LogisticsRouter.delete('/:id',verifyToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const shipment = await LogisticsModel.findById(req.params.id).session(session);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Check if user belongs to the same organization
    if (shipment.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this shipment' });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete shipments' });
    }

    console.log(`Deleting shipment with ID: ${shipment._id}`);

    // Return items to inventory if not delivered
    if (shipment.status !== 'Delivered') {
      for (const item of shipment.items) {
        const inventoryItem = await InventoryItemModel.findById(item.item).session(session);
        
        if (inventoryItem) {
          inventoryItem.quantity += item.quantity;
          await inventoryItem.save({ session });
          console.log(`Returned ${item.quantity} of item ${inventoryItem.name} to inventory`);
        }
      }
    }

    await shipment.remove({ session });
    await session.commitTransaction();

    console.log('Shipment deleted');
    res.json({ message: 'Shipment removed' });
  } catch (err) {
    await session.abortTransaction();
    console.error('Delete shipment error:', err.message);
    res.status(500).send('Server error');
  } finally {
    session.endSession();
  }
});

// Get logistics stats
LogisticsRouter.get('/stats',verifyToken, async (req, res) => {
  try {
    const stats = await LogisticsModel.aggregate([
      { $match: { organization: req.user.organization } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    console.log('Logistics stats:', stats);
    res.json(stats);
  } catch (err) {
    console.error('Get logistics stats error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = LogisticsRouter;
