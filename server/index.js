const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;
const uri = "mongodb://admin:admin@ac-kz1pwwd-shard-00-00.j41rnbf.mongodb.net:27017,ac-kz1pwwd-shard-00-01.j41rnbf.mongodb.net:27017,ac-kz1pwwd-shard-00-02.j41rnbf.mongodb.net:27017/?ssl=true&replicaSet=atlas-z9630z-shard-0&authSource=admin&retryWrites=true&w=majority";

const options = {
  hostname: '192.168.237.103', // Replace with your Arduino's IP address
  port: 80,
  path: '/',
  method: 'GET'
};

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Define a schema for motion events
const motionEventSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create a model based on the schema
const MotionEvent = mongoose.model('MotionEvent', motionEventSchema);

function saveMotionEvent(timestamp) {
  const motionEvent = new MotionEvent({ timestamp });
  motionEvent.save()
    .then(() => {
      console.log('Motion event saved');
    })
    .catch((err) => {
      console.error('Failed to insert motion event', err);
    });
}

setInterval(() => {
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      const response = data.toString();
      console.log(response);

      if (response.includes('Motion detected')) {
        const timestamp = new Date();
        saveMotionEvent(timestamp);
      }
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.end();
}, 10000); // Adjust the interval as needed

app.use(cors());
app.use(express.json());

app.get('/api/motion-events', (req, res) => {
  MotionEvent.find({})
    .then((events) => {
      res.json(events);
    })
    .catch((err) => {
      res.status(500).send('Failed to fetch motion events');
    });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
