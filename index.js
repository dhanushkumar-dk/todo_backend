const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://dhanushkumar-dk.github.io", // Allow requests from your frontend
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);


const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.error("MongoDB connection error:", error));

const todoSchema = new mongoose.Schema({
  category: { type: String, required: true },
  hostname: { type: String, required: true },
  details: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      src: { type: String },
    },
  ],
  status: {
    type: String,
    enum: ["completed", "not completed"],
    required: true,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.post("/api/todos", async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res
      .status(201)
      .json({ message: "Todo added successfully!", todo: newTodo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res
      .status(200)
      .json({ message: "Todo deleted successfully!", deletedTodo: todo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 Export the app for Vercel (Instead of using app.listen)
module.exports = app;
