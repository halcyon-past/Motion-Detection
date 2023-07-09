import './Card.css'

function Card(props) {
  return (
    <div className="card">
        <h2>Motion Detected!!</h2>
        <h3>{props.time}</h3>
    </div>
  )
}

export default Card