const express = require('express');
const DonorRouter = express.Router();
const DonorModel = require('../models/DonorModel');
const { verifyToken } = require('../middleware/validation');

// Get all donors
DonorRouter.get('/',verifyToken, async (req, res) => {
  try {
    const { type, search, sort } = req.query;
    console.log('[GET ALL DONORS] Query params:', { type, search, sort });

    let query = { organization: req.user.organization };
    let sortOptions = { createdAt: -1 };
    
    if (type && type !== 'All Donors') {
      query.type = type;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (sort) {
      if (sort === 'Sort by Name') sortOptions = { name: 1 };
      else if (sort === 'Sort by Date') sortOptions = { createdAt: -1 };
      else if (sort === 'Sort by Amount') sortOptions = { totalDonated: -1 };
    }

    const donors = await DonorModel.find(query).sort(sortOptions);
    console.log(`[GET ALL DONORS] Found ${donors.length} donors`);
    res.json(donors);
  } catch (err) {
    console.error('[GET ALL DONORS] Error:', err.message);
    res.status(500).send('Server error while fetching donors');
  }
});

// Get donor by ID
DonorRouter.get('/:id',verifyToken, async (req, res) => {
  try {
    console.log('[GET DONOR BY ID] Donor ID:', req.params.id);

    const donor = await DonorModel.findById(req.params.id);
    if (!donor) {
      console.warn('[GET DONOR BY ID] Donor not found:', req.params.id);
      return res.status(404).json({ message: 'Donor not found' });
    }

    if (donor.organization.toString() !== req.user.organization.toString()) {
      console.warn('[GET DONOR BY ID] Unauthorized access attempt by user:', req.user.id);
      return res.status(403).json({ message: 'Not authorized to access this donor' });
    }

    console.log('[GET DONOR BY ID] Donor retrieved successfully:', donor.id);
    res.json(donor);
  } catch (err) {
    console.error('[GET DONOR BY ID] Error:', err.message);
    res.status(500).send('Server error while fetching donor');
  }
});

// Create new donor
DonorRouter.post('/', verifyToken,async (req, res) => {
  try {
    console.log('[CREATE DONOR] Request body:', req.body);

    const { name, type, email, phone, address, contactPerson, notes, donations } = req.body; 
    
    const newDonor = new DonorModel({
      name,
      type: type || 'Individual',
      email,
      phone,
      address,
      contactPerson,
      notes,
      donations,
      organization: req.user.organization
    });

    const donor = await newDonor.save();
    console.log('[CREATE DONOR] Donor created successfully:', donor.id);
    res.status(201).json(donor);
  } catch (err) {
    console.error('[CREATE DONOR] Error:', err.message);
    res.status(500).send('Server error while creating donor');
  }
});

// Update donor
DonorRouter.put('/:id', verifyToken, async (req, res) => {
  try {
    console.log('[UPDATE DONOR] Donor ID:', req.params.id);
    console.log('[UPDATE DONOR] Update body:', req.body);

    const { name, type, email, phone, address, contactPerson, notes } = req.body;
    let donor = await DonorModel.findById(req.params.id);

    if (!donor) {
      console.warn('[UPDATE DONOR] Donor not found:', req.params.id);
      return res.status(404).json({ message: 'Donor not found' });
    }

    if (donor.organization.toString() !== req.user.organization.toString()) {
      console.warn('[UPDATE DONOR] Unauthorized update attempt by user:', req.user.id);
      return res.status(403).json({ message: 'Not authorized to update this donor' });
    }

    donor.name = name || donor.name;
    donor.type = type || donor.type;
    donor.email = email || donor.email;
    donor.phone = phone || donor.phone;
    donor.address = address || donor.address;
    donor.contactPerson = contactPerson || donor.contactPerson;
    donor.notes = notes || donor.notes;

    const updatedDonor = await donor.save();
    console.log('[UPDATE DONOR] Donor updated successfully:', updatedDonor.id);
    res.json(updatedDonor);
  } catch (err) {
    console.error('[UPDATE DONOR] Error:', err.message);
    res.status(500).send('Server error while updating donor');
  }
});

// Add donation to donor
DonorRouter.post('/:id/donations',verifyToken, async (req, res) => {
  try {
    console.log('[ADD DONATION] Donor ID:', req.params.id);
    console.log('[ADD DONATION] Donation data:', req.body);

    const { amount, currency, date, type, items, description } = req.body;
    let donor = await DonorModel.findById(req.params.id);

    if (!donor) {
      console.warn('[ADD DONATION] Donor not found:', req.params.id);
      return res.status(404).json({ message: 'Donor not found' });
    }

    if (donor.organization.toString() !== req.user.organization.toString()) {
      console.warn('[ADD DONATION] Unauthorized donation addition by user:', req.user.id);
      return res.status(403).json({ message: 'Not authorized to update this donor' });
    }

    const newDonation = {
      amount,
      currency: currency || 'USD',
      date: date || Date.now(),
      type: type || 'Cash',
      items,
      description
    };

    donor.donations.push(newDonation);
    donor.totalDonated += amount;

    await donor.save();
    console.log('[ADD DONATION] Donation added successfully to donor:', donor.id);
    res.status(201).json(donor);
  } catch (err) {
    console.error('[ADD DONATION] Error:', err.message);
    res.status(500).send('Server error while adding donation');
  }
});

// Delete donor
DonorRouter.delete('/:id',verifyToken, async (req, res) => {
  try {
    console.log('[DELETE DONOR] Donor ID:', req.params.id);

    const donor = await DonorModel.findById(req.params.id);

    if (!donor) {
      console.warn('[DELETE DONOR] Donor not found:', req.params.id);
      return res.status(404).json({ message: 'Donor not found' });
    }

    if (donor.organization.toString() !== req.user.organization.toString()) {
      console.warn('[DELETE DONOR] Unauthorized delete attempt by user:', req.user.id);
      return res.status(403).json({ message: 'Not authorized to delete this donor' });
    }

    if (req.user.role !== 'admin') {
      console.warn('[DELETE DONOR] Delete blocked - user not admin:', req.user.id);
      return res.status(403).json({ message: 'Only admins can delete donors' });
    }

    await donor.remove();
    console.log('[DELETE DONOR] Donor deleted successfully:', donor.id);
    res.json({ message: 'Donor removed' });
  } catch (err) {
    console.error('[DELETE DONOR] Error:', err.message);
    res.status(500).send('Server error while deleting donor');
  }
});

module.exports = DonorRouter;
