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

  function updateTheme(newTheme: string) {
    document.body.style.backgroundColor = `var(--bg${newTheme})`

    console.log(newTheme)
    document.querySelectorAll('.answers__button').forEach(button => {
      button.classList.remove(theme)
      button.classList.add(newTheme)
    })
    document.querySelectorAll('.gameover__meter').forEach(button => {
      button.classList.remove(theme)
      button.classList.add(newTheme)
    })
  }

  updateTheme(theme)
  
  return (
    <div className='layout'>
      <Navbar selectTheme={selectTheme} />
      <div className='layout-outlet'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}