const express = require("express");
const authRoutes = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const UserModel = require("../models/userModel");

// Signup User
authRoutes.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, organization } = req.body;
    console.log("[SIGNUP] Request received:", {
      name,
      email,
      role,
      organization,
    });

    // Check if user already exists
    let user = await UserModel.findOne({ email });
    if (user) {
      console.warn("[SIGNUP] User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Environment variables are always strings, so convert SALT_ROUNDS to number
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10; // fallback to 10 if not set
    console.log("[SIGNUP] Hashing password with salt rounds:", saltRounds);

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("[SIGNUP] Error hashing password:", err.message);
        return res
          .status(500)
          .json({ message: "Error while hashing password" });
      }

      // Create new user
      const newUser = new UserModel({
        name,
        email,
        password: hash,
        role: role || "staff",
        organization,
      });

      await newUser.save();
      console.log("[SIGNUP] New user registered successfully:", newUser.email);

      res.status(201).json({
        message: "You have been successfully registered!",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          organization: newUser.organization,
        },
      });
    });
  } catch (err) {
    console.error("[SIGNUP] Server error:", err.message);
    res.status(500).send("Server error during signup");
  }
});




// Login user
authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("[LOGIN] Request received:", { email });

    // Check if user exists
    const matchingUser = await UserModel.findOne({ email });
    if (!matchingUser) {
      console.warn("[LOGIN] User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordMatched = await bcrypt.compare(password, matchingUser.password);
    if (!isPasswordMatched) {
      console.log("[LOGIN] Invalid password for:", email);  
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    console.log("[LOGIN] User authenticated:", matchingUser.id);

    // Create JWT token with user and organization data
    const payload = {
      id: matchingUser.id,
      organization: matchingUser.organization, // Adding the organization field here
      role: matchingUser.role, // You can also include other details like role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

    console.log("[LOGIN] JWT Token generated successfully");

    res.json({
      token,
      user: {
        id: matchingUser.id,
        name: matchingUser.name,
        email: matchingUser.email,
        role: matchingUser.role,
        organization: matchingUser.organization, // Return the organization info to the client
      },
    });
    console.log("[LOGIN] User logged in successfully:", token);
  } catch (err) {
    console.error("[LOGIN] Server error:", err.message);
    res.status(500).send("Server error during login");
  }
});


module.exports = authRoutes;
