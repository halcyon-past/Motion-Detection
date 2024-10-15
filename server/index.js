const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const mqtt = require("mqtt");

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

// Set up the MQTT client and connect to the broker
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("motion-detection/events", (err) => {
    if (!err) {
      console.log("Subscribed to motion-detection/events");
    } else {
      console.error("Failed to subscribe to topic", err);
    }
  });
});

// Handle incoming MQTT messages
mqttClient.on("message", (topic, message) => {
  if (topic === "motion-detection/events") {
    const motionData = JSON.parse(message.toString());
    console.log("Received motion event: ", motionData);

    if (motionData.motion === true) {
      const motionEvent = new MotionEvent({ motion: motionData.motion });
      motionEvent
        .save()
        .then(() => {
          console.log("Motion event saved to MongoDB");
        })
        .catch((err) => {
          console.error("Failed to save motion event", err);
        });
    } else {
      console.log("Motion event ignored (motion is false)");
    }
  }
});

// API to fetch motion events
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
