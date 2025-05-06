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

  const themeColours = ['Blue', 'Yellow', 'Pink', 'Teal']

  function generateDropdown() {
    return themeColours.map(colour => {
      const l = colour.toLowerCase()
      return (
        <a
          className={`theme__select ${l}`}
          onClick={() => dropdownSelect(l)}
        >{colour}<div></div></a>
      )
    })
  }
  
  return (
    <nav>
      <div className="nav__home">
        <Link to='/'><FaHome /></Link>
      </div>
      <h1>Sean's Country Quiz</h1>
      <img
        width='40px'
        src="/images/themepicker.png"
        className="theme__icon"
        onClick={() => setToggle(prev => !prev)}
      />
      <div className="theme__dropdown">
        <h4>Theme Selector</h4>
        {generateDropdown()}
      </div>
      <div onClick={() => setToggle(prev => !prev)} className="theme__background"></div>
    </nav>
  )
}