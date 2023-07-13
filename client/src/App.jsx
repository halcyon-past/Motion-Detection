import Card from "./components/Card";
import "./App.css";
import { useState, useEffect } from "react";

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
    const fetchMotionEvents = async () => {
      try {
        const response = await fetch("https://motion-detection.onrender.com/api/motion-events");
        const data = await response.json();
        const formattedLogs = data.map((event) => {
          const timestamp = new Date(event.timestamp);
          return formatTimestamp(timestamp);
        });
        setLogs(formattedLogs);
      } catch (error) {
        console.error("Failed to fetch motion events", error);
      }
    };

    fetchMotionEvents();

    const interval = setInterval(() => {
      fetchMotionEvents();
    }, 5000);

    return () => {
      clearInterval(interval);
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
