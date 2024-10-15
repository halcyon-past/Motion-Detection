# Real-Time Motion Detection System

This project is a real-time motion detection system using an ESP8266 microcontroller, MQTT protocol, and a React + Vite frontend for displaying motion events in real-time. It involves sending motion detection data from an ESP8266 device, publishing the data to an MQTT broker, and displaying these events in a web-based dashboard.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [ESP8266 Setup](#esp8266-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Working](#working)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Overview
The system consists of three major parts:
1. **ESP8266 Microcontroller**: Detects motion using a PIR sensor and sends the motion data to an MQTT broker.
2. **Backend Server**: A Node.js server using MQTT to capture and store motion events in a MongoDB database.
3. **React + Vite Frontend**: A web interface that subscribes to the MQTT broker and displays motion events in real-time.

## Features
- Real-time motion detection using MQTT protocol.
- PIR sensor connected to ESP8266 to detect motion events.
- Web-based dashboard to view live motion logs.
- Backend powered by Node.js and MongoDB to store motion logs.
- Highly responsive interface with real-time updates using MQTT and WebSockets.

## Architecture
- **ESP8266** publishes motion events to an MQTT broker.
- **Backend** subscribes to the MQTT broker and stores events in a MongoDB database.
- **Frontend** subscribes to the same MQTT topic to display real-time motion events.

## Prerequisites
Before starting the setup, make sure you have the following installed:
- **Node.js** and **npm**
- **MongoDB** database
- **Arduino IDE** (for ESP8266 programming)
- **MQTT Broker** (e.g., HiveMQ, Mosquitto)
- **React + Vite** for frontend development

## Setup Instructions

### ESP8266 Setup

1. **Hardware Requirements**:
   - ESP8266 microcontroller
   - PIR sensor
   - Jumper wires
   - Breadboard

2. **Pseudocode for ESP8266**:
   - Initialize the Wi-Fi connection.
   - Connect to the MQTT broker using the provided credentials.
   - Continuously check for motion using the PIR sensor:
     - If motion is detected:
       - Publish a message to the `motion-detection/events` topic indicating motion detected.
     - Else, publish a message indicating no motion.
   - Repeat the loop with a small delay to avoid spamming the network.

3. **Connections**:
   - Connect the PIR sensor's VCC, GND, and OUT to the ESP8266's 3.3V, GND, and D2 pin, respectively.

4. **MQTT Broker**:
   - Use a public MQTT broker like `broker.hivemq.com` or set up your own broker.

### Backend Setup

1. **Install dependencies**:
   ```bash
   npm install express mongoose cors dotenv mqtt
   ```

2. **Pseudocode for Backend**:
   - Initialize the server and connect to the MongoDB database.
   - Set up the MQTT client and connect to the broker.
   - Subscribe to the `motion-detection/events` topic.
   - On receiving a message from the MQTT broker:
     - Parse the motion data from the message.
     - If motion is detected, save the event to MongoDB with the current timestamp.
   - Provide an API endpoint (`/api/motion-events`) that fetches all stored motion events from the database.

3. **Environment Variables**:
   Create a `.env` file with the following:
   ```
   MONGO_URL=mongodb://localhost:27017/motiondb
   ```

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   npm install mqtt
   ```

2. **Pseudocode for Frontend**:
   - Use the `mqtt` library to connect to the MQTT broker via WebSocket.
   - Subscribe to the `motion-detection/events` topic.
   - On receiving a message from the MQTT broker:
     - Parse the message and format the timestamp.
     - Update the state with the new motion event and display it in the UI in real-time.
   - Continuously listen for new messages and update the UI accordingly.

3. **User Interface**:
   - Display the motion logs in a card-based layout.
   - Each log entry shows the time when the motion was detected.

### Working

1. **ESP8266**:
   - Detects motion using a PIR sensor and publishes data to an MQTT broker (`motion-detection/events` topic).

2. **Backend**:
   - Subscribes to the MQTT topic, listens for incoming messages, and stores the motion events in a MongoDB database.

3. **Frontend**:
   - Subscribes to the MQTT broker and listens for real-time motion events, displaying them immediately in the web UI.

### Future Enhancements
- Implement user authentication to secure access to motion events.
- Visualize motion detection data over time using charts and graphs.
- Add support for multiple sensors and more complex event handling.

## License
This project is licensed under the MIT License.