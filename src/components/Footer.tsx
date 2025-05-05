import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__links">
        <Link to='/'>Home</Link>
        <Link to='/play'>Play</Link>
        <Link to='/stats'>Stats</Link>
      </div>
      <i>Website created by Sean Cruickshank © 2025</i>
    </footer>
  )
}