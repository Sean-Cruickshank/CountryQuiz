import React from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaPalette, FaPlay } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { nanoid } from "nanoid";

interface NavbarProps {
  selectTheme: (newTheme: string, type: string) => void
  theme: string,
  indicator: string,
  redirectWarning: boolean
}

export default function Navbar({ selectTheme, theme, indicator, redirectWarning}: NavbarProps) {

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
  const navigate = useNavigate()
  const location = useLocation()

  function handleRedirect(path: string) {
    if (location.pathname === '/play' && redirectWarning) {
      const confirmation = window.confirm(`Are you sure you want to leave the page? All current game progress will be lost`)
      confirmation && navigate(path)
    }
    else navigate(path)
  }
  
  return (
    <nav className={`nav ${theme}`}>
      <div title="Sean's Country Quiz" onClick={() => handleRedirect('/')} className="nav__title">
        <h1>SEAN'S COUNTRY QUIZ</h1>
      </div>

      <div className="nav__icons">
        <div
          title="Home"
          onClick={() => handleRedirect('/')}
          className="nav__icon nav__home"
        ><FaHome /></div>

        <div
          title="New Game"
          onClick={() => handleRedirect('/start')}
          className="nav__icon nav__new-game"
        ><FaPlay /></div>

        <div
          title="Stats"
          onClick={() => handleRedirect('/stats')}
          className="nav__icon nav__stats"
        ><ImStatsBars /></div>   

        <div className="nav__icon">
          <div
            title="Theme Selector"
            className="theme"
            onClick={() => setToggle(prev => !prev)}
          ><FaPalette /></div>
        </div>
      </div>

      {/* <div className="theme">
        <img
          title="Theme Selector"
          src="/images/themepicker.png"
          className="theme__icon"
          onClick={() => setToggle(prev => !prev)}
        />
      </div> */}

      <div className="theme__dropdown">
        <h4>THEMES</h4>
        {generateThemes()}
        <h4>ANSWER THEMES</h4>
        <div className="indicator__grid">
          {generateIndicators()}
        </div>
      </div>
      <div onClick={() => setToggle(prev => !prev)} className="theme__background"></div>
    </nav>
  )
}