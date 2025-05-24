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
        <i>Website created by Sean Cruickshank © 2025</i>
        <a
          target="_blank"
          href="https://seancruickshank.co.nz"
        ><img src="/images/coollogo2.png" /></a>
      </div>
    </footer>
  )
}