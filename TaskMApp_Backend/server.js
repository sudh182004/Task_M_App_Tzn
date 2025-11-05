import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnection from "./config/db.js";
import User from "./models/userModel.js";
import Task from "./models/taskModel.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
dbConnection();

// Signup
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashed });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Signup successful",
      user: newUser,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Create new task
app.post("/api/tasks", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const newTask = await Task.create({
      title,
      description,
      status: "Pending",
      userId: req.user.id,
    });
    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all tasks (filter support)
app.get("/api/tasks", authMiddleware, async (req, res) => {
  const { status, title } = req.query;
  const filter = { userId: req.user.id };

  if (status) filter.status = status;
  if (title) filter.title = new RegExp(title, "i");

  try {
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark as completed
app.put("/api/tasks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { status: "Completed" },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit Task (update title & description)
app.put("/api/tasks/:id/edit", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, description },
      { new: true }
    );

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Task
app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
