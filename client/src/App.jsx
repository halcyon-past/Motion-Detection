import { useState, useEffect } from "react";
import Card from "./components/Card";
import mqtt from "mqtt";
import "./App.css";

function App() {
  const [logs, setLogs] = useState([]);

  const formatTimestamp = (timestamp) => {
    const date = timestamp.getDate();
    const month = timestamp.getMonth() + 1;
    const year = timestamp.getFullYear();
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    const seconds = timestamp.getSeconds();

    const formattedDate = `${date}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate} ${formattedTime}`;
  };

  useEffect(() => {
    // MQTT connection options
    const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("motion-detection/events", (err) => {
        if (!err) {
          console.log("Subscribed to motion-detection/events");
        }
      });
    });

    client.on("message", (topic, message) => {
      if (topic === "motion-detection/events") {
        const motionEvent = JSON.parse(message.toString());
        const timestamp = new Date();
        const formattedLog = formatTimestamp(timestamp);

        setLogs((prevLogs) => [formattedLog, ...prevLogs]); // Add the latest event at the top
      }
    });

    return () => {
      client.end(); // Clean up the MQTT connection when the component is unmounted
    };
  }, []);

  return (
    <div className="container">
      <h1>Motion Log</h1>
      <div className="items">
        {logs.map((log, index) => (
          <Card key={index} time={log} />
        ))}
      </div>
    </div>
  );
}

export default App;
