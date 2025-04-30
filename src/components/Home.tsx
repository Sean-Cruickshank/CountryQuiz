import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div>
      <p>Home</p>
      <Link to="/play">Start Game</Link>
      <Link to="/stats">View Stats</Link>
    </div>
  )
}