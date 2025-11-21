import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__nav">
        <Link
          title="Home"
          className="footer__navlink"
          to='/'
        >Home</Link>
        <Link
          title="Play"
          className="footer__navlink"
          to='/play'
        >Play</Link>
        <Link
          title="Stats"
          className="footer__navlink"
          to='/stats'
        >Stats</Link>
      </div>
      <div className="footer__links">
        <i>
          Website created by <a className="footer__link" target="_blank" href="https://www.seancruickshank.co.nz">
            Sean Cruickshank
          </a> © 2025</i>
      </div>
    </footer>
  )
}