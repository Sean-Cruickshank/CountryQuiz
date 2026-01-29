import { Outlet } from "react-router-dom"
import React from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"


export default function Layout() {

  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'blue')
  const [indicator, setIndicator] = React.useState(localStorage.getItem('indicator') || 'greenred')
  const [unit, setUnit] = React.useState(localStorage.getItem('unit') || 'metric')

  // Detects whether a game is currently active with at least one round completed
  // Determines whether or not to trigger a redirect warning popup
  const [redirectWarning, setRedirectWarning] = React.useState(false)
  
  const themeUpdateList = [
    'html', '.nav', '.footer',
    '.home', '.play-game', '.recap',
    '.meter', '.button', '.range', '.switch', '.log', '.panel'
  ]

  const indicatorUpdateList = [
    '.node',
    '.recap',
    '.log__guess'
  ]
  
  function handleSettings(change: string, setting: string) {
    if (setting === 'theme') {
      updateTheme(change)
      setTheme(change)
    }

    if (setting === 'indicator') {
      updateIndicator(change)
      setIndicator(change)
    }

    if (setting === 'unit') {
      setUnit(change)
    }
  }

  function updateTheme(newTheme: string) {
    themeUpdateList.forEach(item => {
      document.querySelectorAll(item).forEach(button => {
        button.classList.remove(theme)
        button.classList.add(newTheme)
      })
    })
  }

  function updateIndicator(newIndicator: string) {
    indicatorUpdateList.forEach(item => {
      document.querySelectorAll(item).forEach(button => {
        button.classList.remove(indicator)
        button.classList.add(newIndicator)
      })
    })
  }

  React.useEffect(() => {
    updateTheme(theme)
    updateIndicator(indicator)

    function handleKeyDown(event: KeyboardEvent) {
      let className = ''
      event.key === 'a' || event.key === 'A' || event.key === '1' ? className = '.answer__button-A' : ''
      event.key === 'b' || event.key === 'B' || event.key === '2' ? className = '.answer__button-B' : ''
      event.key === 'c' || event.key === 'C' || event.key === '3' ? className = '.answer__button-C' : ''
      event.key === 'd' || event.key === 'D' || event.key === '4' ? className = '.answer__button-D' : ''
      event.key === 'P' || event.key === 'p' ? className = '.button__play-again' : ''
      event.key === 'H' || event.key === 'h' ? className = '.nav__home' : ''
      event.key === 'N' || event.key === 'n' ? className = '.nav__new-game' : ''
      event.key === 'S' || event.key === 's' ? className = '.nav__stats' : ''
      event.key === 'Escape' ? className = '.resign-button' : ''
      if (className) {
        let element: HTMLElement | null = document.querySelector(className)
        if (element) element?.click()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  },[])

  React.useEffect(() => {
    localStorage.setItem('theme', theme)
  },[theme])

  React.useEffect(() => {
    localStorage.setItem('indicator', indicator)
  },[indicator])

  React.useEffect(() => {
    localStorage.setItem('unit', unit)
  },[unit])
  
  return (
    <>
      <Navbar
        theme={theme} indicator={indicator} unit={unit}
        handleSettings={handleSettings}
        redirectWarning={redirectWarning}
      />

      <div className='layout-outlet'>
        <Outlet context={{theme, indicator, unit, setRedirectWarning}} />
      </div>

      <Footer theme={theme} />
    </>
  )
}