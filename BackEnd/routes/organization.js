const express = require('express');
const OrganizationRouter = express.Router();
const OrganizationModel = require('../models/OrganizationModel');

// CREATE a new organization
OrganizationRouter.post('/', async (req, res) => {
  try {
    const organizationData = req.body;
    console.log('Creating a new organization with the following data:', organizationData);

    const newOrganization = new OrganizationModel(organizationData);
    const savedOrganization = await newOrganization.save();
    console.log('Organization created successfully:', savedOrganization);

    res.status(201).json(savedOrganization);
  } catch (error) {
    console.error('Error creating organization:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// GET all organizations
OrganizationRouter.get('/', async (req, res) => {
  try {
    console.log('Fetching all organizations');
    const organizations = await OrganizationModel.find();
    console.log('Fetched organizations:', organizations);

    res.status(200).json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET a single organization by ID
OrganizationRouter.get('/:id', async (req, res) => {
  try {
    console.log(`Fetching organization with ID: ${req.params.id}`);
    const organization = await OrganizationModel.findById(req.params.id);

    if (!organization) {
      console.log('Organization not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Organization not found' });
    }

    console.log('Organization found:', organization);
    res.status(200).json(organization);
  } catch (error) {
    console.error(`Error fetching organization with ID: ${req.params.id}`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE an organization by ID
OrganizationRouter.put('/:id', async (req, res) => {
  try {
    console.log(`Updating organization with ID: ${req.params.id} with data:`, req.body);
    const updatedOrganization = await OrganizationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedOrganization) {
      console.log('Organization not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Organization not found' });
    }

    console.log('Organization updated successfully:', updatedOrganization);
    res.status(200).json(updatedOrganization);
  } catch (error) {
    console.error(`Error updating organization with ID: ${req.params.id}`, error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE an organization by ID
OrganizationRouter.delete('/:id', async (req, res) => {
  try {
    console.log(`Deleting organization with ID: ${req.params.id}`);
    const deletedOrganization = await OrganizationModel.findByIdAndDelete(req.params.id);

    if (!deletedOrganization) {
      console.log('Organization not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Organization not found' });
    }

    console.log('Organization deleted successfully');
    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error(`Error deleting organization with ID: ${req.params.id}`, error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = OrganizationRouter;
