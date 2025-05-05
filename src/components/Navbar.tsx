import React from "react"
import { Link } from "react-router-dom";

import { FaHome } from "react-icons/fa";

interface NavbarProps {
  selectTheme: (data: string) => void
}

export default function Navbar({ selectTheme }: NavbarProps) {

  // const currentTheme = localStorage.getItem('theme') || 'blue'

  const [toggle, setToggle] = React.useState(false)

  React.useEffect(() => {
    const dropdown = document.querySelector('.theme__dropdown')
    const background = document.querySelector('.theme__background')
    if (toggle) {
      dropdown?.classList.add('active')
      background?.classList.add('active')
    }
    if (!toggle) {
      dropdown?.classList.remove('active')
      background?.classList.remove('active')
    }
  },[toggle])

  function dropdownSelect(colour: string) {
    selectTheme(colour)
    setToggle(prev => !prev)
  }
  
  return (
    <nav>
      <div className="nav__home">
        <Link to='/'><FaHome /></Link>
      </div>
      <img
        width='40px'
        src="/images/themepicker.png"
        className="theme__icon"
        onClick={() => setToggle(prev => !prev)}
      />
      <div className="theme__dropdown">
        <p>Theme Selector</p>
        <a
          className="theme__select blue"
          onClick={() => dropdownSelect('blue')}
        >Blue<div></div></a>
        <a
          className="theme__select yellow"
          onClick={() => dropdownSelect('yellow')}
        >Yellow<div></div></a>
        <a
          className="theme__select pink"
          onClick={() => dropdownSelect('pink')}
        >Pink<div></div></a>
        <a
          className="theme__select teal"
          onClick={() => dropdownSelect('teal')}
        >Teal<div></div></a>
      </div>
      <div onClick={() => setToggle(prev => !prev)} className="theme__background"></div>
    </nav>
  )
}