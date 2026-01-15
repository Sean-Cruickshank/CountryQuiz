import { Outlet } from "react-router-dom"
import React from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout() {

  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'blue')
  const [indicator, setIndicator] = React.useState(localStorage.getItem('indicator') || 'greenred')

  // Detects whether a game is currently active with at least one round completed
  // Determines whether or not to trigger a redirect warning popup
  const [redirectWarning, setRedirectWarning] = React.useState(false)

  React.useEffect(() => {
    updateTheme(theme)
    updateIndicator(indicator)
  },[])

  // Enables keyboard functionality for shortcuts
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      let className = ''
      event.key === 'a' || event.key === 'A' || event.key === '1' ? className = '.answer__button-A' : ''
      event.key === 'b' || event.key === 'B' || event.key === '2' ? className = '.answer__button-B' : ''
      event.key === 'c' || event.key === 'C' || event.key === '3' ? className = '.answer__button-C' : ''
      event.key === 'd' || event.key === 'D' || event.key === '4' ? className = '.answer__button-D' : ''
      event.key === 'P' || event.key === 'p' ? className = '.play-again-button' : ''
      event.key === 'H' || event.key === 'h' ? className = '.nav__home' : ''
      event.key === 'N' || event.key === 'n' ? className = '.nav__new-game' : ''
      event.key === 'S' || event.key === 's' ? className = '.nav__stats' : ''
      event.key === 'Escape' ? className = '.resign-button' : ''
      let element: HTMLElement | null = document.querySelector(className)
      if (element) element?.click()
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

  function selectTheme(newTheme: string, type: string) {
    
    if (type === 'theme') {
      updateTheme(newTheme)
      setTheme(newTheme)
    } else if (type === 'indicator') {
      updateIndicator(newTheme)
      setIndicator(newTheme)
    }
  }

  // Class names for every element on the page that needs to be updated when the theme changes
  const themeUpdateList = [
    'html',
    '.home',
    '.nav',
    '.footer',
    '.answers__option',
    '.meter',
    '.button',
    '.start-game__range',
    '.switch__input',
    '.log',
    '.panel'
  ]

  function updateTheme(newTheme: string) {
    // Runs a forEach inside updateTheme to replace the old theme with the new one
    themeUpdateList.forEach(item => {
      document.querySelectorAll(item).forEach(button => {
        button.classList.remove(theme)
        button.classList.add(newTheme)
      })
    })

    // These two control the colour theme for the user's highlighted answer in the recap
    document.querySelector('.recap__answers__guess')?.classList.remove(theme)
    document.querySelector('.recap__answers__guess')?.classList.add(newTheme)

    document.querySelector('.play-game__question')?.classList.remove(theme)
    document.querySelector('.play-game__question')?.classList.add(newTheme)

    document.querySelector('.play-game__progress')?.classList.remove(theme)
    document.querySelector('.play-game__progress')?.classList.add(newTheme)
  }

  const indicatorUpdateList = [
    '.node',
    '.recap',
    '.log__guess'
  ]

  function updateIndicator(newIndicator: string) {
    indicatorUpdateList.forEach(item => {
      document.querySelectorAll(item).forEach(button => {
        button.classList.remove(indicator)
        button.classList.add(newIndicator)
      })
    })
  }
  
  return (
    <>
      <Navbar theme={theme} indicator={indicator} selectTheme={selectTheme} redirectWarning={redirectWarning} />
      <div className='layout-outlet'>
        <Outlet context={{theme, indicator, setRedirectWarning}} />
      </div>
      <Footer theme={theme} />
    </>
  )
}