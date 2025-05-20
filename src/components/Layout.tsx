import { Outlet } from "react-router-dom"
import React from "react"

import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout() {

  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'blue')

  const [indicator, setIndicator] = React.useState(localStorage.getItem('indicator') || 'greenred')

  React.useEffect(() => {
    updateTheme(theme)
    updateIndicator(indicator)
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
    '.answers__option',
    '.gameover__meter',
    '.stats__meter',
    '.footer__navlink',
    '.button'
  ]

  function updateTheme(newTheme: string) {
    document.body.style.backgroundColor = `var(--${newTheme}A)`

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
  }

  const indicatorUpdateList = [
    '.node',
    '.recap',
    '.log__entry'
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
      <Navbar selectTheme={selectTheme} />
      <div className='layout-outlet'>
        <Outlet />
      </div>
      <Footer />
    </>
  )
}