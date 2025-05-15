import { Outlet } from "react-router-dom"
import React from "react"

import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout() {

  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'blue')

  function selectTheme(newTheme: string) {
    updateTheme(newTheme)
    setTheme(newTheme)
  }

  React.useEffect(() => {
    localStorage.setItem('theme', theme)
  },[theme])

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

  updateTheme(theme)
  
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