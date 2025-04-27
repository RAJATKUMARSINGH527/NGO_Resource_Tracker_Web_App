const express = require("express");
const mongoose = require("mongoose");
const InventoryRouter = express.Router();
const InventoryItemModel = require("../models/InventoryItemModel");
const { verifyToken } = require("../middleware/validation");

// Get all inventory items
InventoryRouter.get("/",verifyToken, async (req, res) => {
  try {
    const { category, location, search } = req.query;
    console.log("[INVENTORY] Fetching items:", { category, location, search });

    let query = { organization: req.user.organization };

    if (category && category !== "All Categories") {
      query.category = category;
    }

    if (location && location !== "All Locations") {
      query.location = location;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const items = await InventoryItemModel.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("[INVENTORY] Error fetching items:", err.stack);
    res.status(500).json({ message: "Server error while fetching inventory items" });
  }
});

// Get inventory item by ID
InventoryRouter.get("/:id",verifyToken, async (req, res) => {
  try {
    console.log("[INVENTORY] Fetching item ID:", req.params.id);

    const item = await InventoryItemModel.findById(req.params.id);

    if (!item) {
      console.warn("[INVENTORY] Item not found:", req.params.id);
      return res.status(404).json({ message: "Inventory item not found" });
    }

    if (item.organization.toString() !== req.user.organization.toString()) {
      console.warn("[INVENTORY] Unauthorized access attempt by user:", req.user.id);
      return res.status(403).json({ message: "Not authorized to access this item" });
    }

    res.json(item);
  } catch (err) {
    console.error("[INVENTORY] Error fetching item:", err.stack);
    res.status(500).json({ message: "Server error while fetching inventory item" });
  }
});

// Create inventory item
InventoryRouter.post("/",verifyToken, async (req, res) => {
  try {
    console.log("[INVENTORY] Creating new item:", req.body.name);

    const {
      name,
      description,
      category,
      quantity,
      unit = "units",
      location,
      expiryDate,
      batchNumber,
    } = req.body;

    const newItem = new InventoryItemModel({
      name,
      description,
      category,
      quantity,
      unit,
      location,
      expiryDate,
      batchNumber,
      organization: req.user.organization,
      createdBy: req.user.id,
      lastUpdatedBy: req.user.id,
    });

    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("[INVENTORY] Error creating item:", err.stack);
    res.status(500).json({ message: "Server error while creating inventory item" });
  }
});

// Update inventory item
InventoryRouter.put("/:id", verifyToken,async (req, res) => {
  try {
    console.log("[INVENTORY] Updating item ID:", req.params.id);

    const {
      name,
      description,
      category,
      quantity,
      unit,
      location,
      expiryDate,
      batchNumber,
    } = req.body;

    let item = await InventoryItemModel.findById(req.params.id);

    if (!item) {
      console.warn("[INVENTORY] Item not found for update:", req.params.id);
      return res.status(404).json({ message: "Inventory item not found" });
    }

    if (item.organization.toString() !== req.user.organization.toString()) {
      console.warn("[INVENTORY] Unauthorized update attempt by user:", req.user.id);
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    item.name = name ?? item.name;
    item.description = description ?? item.description;
    item.category = category ?? item.category;
    item.quantity = quantity ?? item.quantity;
    item.unit = unit ?? item.unit;
    item.location = location ?? item.location;
    item.expiryDate = expiryDate ?? item.expiryDate;
    item.batchNumber = batchNumber ?? item.batchNumber;
    item.lastUpdatedBy = req.user.id;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    console.error("[INVENTORY] Error updating item:", err.stack);
    res.status(500).json({ message: "Server error while updating inventory item" });
  }
});

// Delete inventory item
InventoryRouter.delete("/:id",verifyToken, async (req, res) => {
  try {
    console.log("[INVENTORY] Deleting item ID:", req.params.id);

    const item = await InventoryItemModel.findById(req.params.id);

    if (!item) {
      console.warn("[INVENTORY] Item not found for deletion:", req.params.id);
      return res.status(404).json({ message: "Inventory item not found" });
    }

    if (item.organization.toString() !== req.user.organization.toString()) {
      console.warn("[INVENTORY] Unauthorized delete attempt by user:", req.user.id);
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    if (req.user.role !== "admin") {
      console.warn("[INVENTORY] Non-admin delete attempt by user:", req.user.id);
      return res.status(403).json({ message: "Only admins can delete inventory items" });
    }

    await InventoryItemModel.deleteOne({ _id: item._id });
    res.json({ message: "Inventory item successfully removed" });
  } catch (err) {
    console.error("[INVENTORY] Error deleting item:", err.stack);
    res.status(500).json({ message: "Server error while deleting inventory item" });
  }
});

// Get inventory stats
InventoryRouter.get("/stats/overview",verifyToken, async (req, res) => {
  try {
    console.log("[INVENTORY] Fetching inventory stats for organization:", req.user.organization);

    const totalCount = await InventoryItemModel.countDocuments({
      organization: req.user.organization,
    });

    const categoryStats = await InventoryItemModel.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(req.user.organization),
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const locationStats = await InventoryItemModel.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(req.user.organization),
        },
      },
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalCount,
      categoryStats,
      locationStats,
    });
  } catch (err) {
    console.error("[INVENTORY] Error fetching stats:", err.stack);
    res.status(500).json({ message: "Server error while fetching inventory stats" });
  }
});

module.exports = InventoryRouter;
