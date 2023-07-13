const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const uri = process.env.MONGO_URL;

// Connect to MongoDB using Mongoose
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Define a schema for motion events
const motionEventSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  motion: {
    type: Boolean,
    required: true,
  },
});

// Create a model based on the schema
const MotionEvent = mongoose.model("MotionEvent", motionEventSchema);

app.use(cors());
app.use(express.json());

app.post("/api/motion-events", (req, res) => {
  const { motion } = req.body;

  if (motion === true) {
    const motionEvent = new MotionEvent({ motion });
    motionEvent
      .save()
      .then(() => {
        console.log("Motion event saved");
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error("Failed to insert motion event", err);
        res.sendStatus(500);
      });
  } else {
    console.log("Motion event ignored (motion is false)");
    res.sendStatus(200);
  }
});

app.get("/api/motion-events", (req, res) => {
  MotionEvent.find({})
    .then((events) => {
      res.json(events);
    })
    .catch((err) => {
      res.status(500).send("Failed to fetch motion events");
    });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
