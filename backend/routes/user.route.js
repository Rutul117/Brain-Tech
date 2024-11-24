const { Router } = require("express");
require("dotenv").config();

const { UserModel } = require("../models/user.model");
const { BlacklistModel } = require("../models/blacklist.model");
const { authMiddleware } = require("../middlewares/auth.middleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = Router();

// Get Data
userRouter.get("/",authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.find();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Registration
userRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User Exists Already, Please Login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();
    return res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// Login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Email" });
    }

    const ValidPassword = await bcrypt.compare(password, user.password);
    if (!ValidPassword) {
      return res.status(400).send({ message: "Invalid Password" });
    }

    // Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: 60,
    });
    // Refresh Token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REF_SECRET,
      {
        expiresIn: "7h",
      }
    );
    // Valid email and Password
    if (user && ValidPassword) {
      return res
        .status(201)
        .send({ message: "Log in successfully", token, refreshToken });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// Notes
userRouter.get("/notes", authMiddleware, async (req, res) => {
  res.send("Notes are available");
});

// Logout
userRouter.post("/logout", authMiddleware, async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const blacklistedToken = new BlacklistModel({ token });
    await blacklistedToken.save();
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// API for Refresh tokens
userRouter.post("/api/refresh", async (req, res) => {
  try {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(refreshToken, process.env.REF_SECRET);

    // Verify refresh token
    if (decoded) {
      const token = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        {
          expiresIn: 60,
        }
      );
      res.status(200).send({ token });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = {
  userRouter,
};
