import React from "react"
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { nanoid } from "nanoid";

interface NavbarProps {
  selectTheme: (newTheme: string, type: string) => void
  theme: string,
  indicator: string
}

export default function Navbar({ selectTheme, theme, indicator }: NavbarProps) {

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

  function dropdownSelect(colour: string, type: string) {
    selectTheme(colour, type)
    setToggle(prev => !prev)
  }

  const themeColours = ['Blue', 'Yellow', 'Green', 'Orange', 'Pink', 'Teal', 'Purple']

  function generateThemes() {
    return themeColours.map(colour => {
      const l = colour.toLowerCase()
      return (
        <a
          key={nanoid()}
          className={`theme__select ${l} ${l === theme ? 'active' : ''}`}
          onClick={() => dropdownSelect(l, 'theme')}
        >{colour}<div></div></a>
      )
    })
  }

  const indicatorColours = ['greenred', 'blueyellow', 'tealtan', 'orangeblue', 'bluepink', 'yellowpink']

  function generateIndicators() {
    return indicatorColours.map(colour => {
      const l = colour.toLowerCase()
      return (
        <a
          key={nanoid()}
          className={`indicator__select ${l} ${l === indicator ? 'active' : ''}`}
          onClick={() => dropdownSelect(l, 'indicator')}
        >
          <div className="indicator__samples">
            <div id="sampleA" className="indicator__sample"></div>
            <div id="sampleB" className="indicator__sample"></div>
          </div>
          
        </a>
      )
    })
  }
  
  return (
    <nav>
      <div className="nav__home">
        <Link title="Home" to='/'><FaHome /></Link>
      </div>
      <div className="theme">
        <img
          title="Theme Selector"
          src="/images/themepicker.png"
          className="theme__icon"
          onClick={() => setToggle(prev => !prev)}
        />
      </div>
      <div className="theme__dropdown">
        <h4>Background Theme</h4>
        {generateThemes()}
        <h4>Answer Theme</h4>
        <div className="indicator__grid">
          {generateIndicators()}
        </div>
      </div>
      <div onClick={() => setToggle(prev => !prev)} className="theme__background"></div>
    </nav>
  )
}