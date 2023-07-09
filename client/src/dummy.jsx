import Card from './components/Card'
import './App.css'
import {useState,useEffect} from 'react';

function App() {

  const [logs, setLogs] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      var timestamp = new Date();
      var date = timestamp.getDate()+"-"+(timestamp.getMonth()+1)+"-"+timestamp.getFullYear();
      var time = timestamp.getHours()+":"+timestamp.getMinutes()+":"+timestamp.getSeconds();
      var log = date+" "+time;
      setLogs(log);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>Motion Log</h1>
      <div className="items">
        <Card time={logs}/>
        <Card time={logs}/>
        <Card time={logs}/>
      </div>
    </div>
  )
}

export default App
