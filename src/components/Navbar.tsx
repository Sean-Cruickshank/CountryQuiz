import React from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaPlay } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { ImStatsBars } from "react-icons/im";
import { nanoid } from "nanoid";

interface NavbarProps {
  handleSettings: (change: string, setting: string) => void
  theme: string,
  indicator: string,
  unit: string,
  redirectWarning: boolean
}

export default function Navbar({ handleSettings, theme, indicator, unit, redirectWarning}: NavbarProps) {

  const [toggle, setToggle] = React.useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const themeColours = ['Blue', 'Yellow', 'Green', 'Orange', 'Pink', 'Teal', 'Purple']
  const indicatorColours = ['greenred', 'blueyellow', 'tealtan', 'orangeblue', 'bluepink', 'yellowpink']
  
  function generateThemes() {
    return themeColours.map(colour => {
      const l = colour.toLowerCase()
      return (
        <button
          key={nanoid()}
          className={`theme__button ${l} ${l === theme ? 'active' : ''}`}
          onClick={() => handleDropdown(l, 'theme')}
          >{colour}<div></div></button>
        )
    })
  }
  
  function generateIndicators() {
    return indicatorColours.map(colour => {
      const l = colour.toLowerCase()
      return (
        <button
        key={nanoid()}
        className={`indicator__button ${l} ${l === indicator ? 'active' : ''}`}
        onClick={() => handleDropdown(l, 'indicator')}
        >
          <div className="indicator__samples">
            <div id="sampleA" className="indicator__sample"></div>
            <div id="sampleB" className="indicator__sample"></div>
          </div>
          
        </button>
      )
    })
  }

  function handleDropdown(change: string, setting: string) {
    handleSettings(change, setting)
    setToggle(prev => !prev)
  }

  function handleRedirect(path: string) {
    if (location.pathname === '/play') {
      if (redirectWarning) {
        const confirmation = window.confirm(`Are you sure you want to leave the page? All current game progress will be lost!`)
        confirmation && navigate(path, {replace: true})
      } else {
        navigate(path, {replace: true})
      }
    }
    else navigate(path)
  }

  React.useEffect(() => {
    const dropdown = document.querySelector('.settings__dropdown')
    const background = document.querySelector('.settings__background')
    if (toggle) {
      dropdown?.classList.add('active')
      background?.classList.add('active')
    }
    if (!toggle) {
      dropdown?.classList.remove('active')
      background?.classList.remove('active')
    }
  },[toggle])
  
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
            title="Settings"
            className="settings"
            onClick={() => setToggle(prev => !prev)}
          ><FaGear /></div>
        </div>
      </div>

      <div className="settings__dropdown">
        <h4>BACKGROUND</h4>
        {generateThemes()}

        <h4>ANSWER THEMES</h4>
        <div className="indicator__grid">
          {generateIndicators()}
        </div>

        <h4>UNIT SYSTEM</h4>
        <div className="unit">
          <button
            className={`unit__button ${unit === 'metric' ? 'active' : ''}`}
            onClick={() => handleDropdown('metric', 'unit')}
          >Metric</button>
          <button
            className={`unit__button ${unit === 'imperial' ? 'active' : ''}`}
            onClick={() => handleDropdown('imperial', 'unit')}
          >Imperial</button>
          <button
            className={`unit__button ${unit === 'both' ? 'active' : ''}`}
            onClick={() => handleDropdown('both', 'unit')}
          >Both</button>
        </div>
      </div>

      <div onClick={() => setToggle(prev => !prev)} className="settings__background"></div>
    </nav>
  )
}