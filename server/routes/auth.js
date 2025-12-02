const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
    });
    res.json({ message: "User registered" });
  } catch {
    res.status(400).json({ message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.PASSWORD_ENCYPTION_KEY, {
    expiresIn: "1d",
  });
  res.json({ token });
});

router.get("/me", auth, async (req, res) => {
  try {
    const current = await User.findById(req.user.id).select("-password");
    if (!current) return res.status(404).json({ message: "User not found" });
    res.json(current);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
