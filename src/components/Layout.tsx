import { Outlet } from "react-router-dom"
import React from "react"

import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout() {

  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'blue')

  function selectTheme(data: React.ChangeEvent<HTMLSelectElement>) {
    const newTheme = data.target.value
    updateTheme(newTheme)
    setTheme(newTheme)
    localStorage.setItem('theme', theme)
  }

  function updateTheme(newTheme: string) {
    document.body.style.backgroundColor = `var(--${newTheme})`

    document.querySelectorAll('.answers__button').forEach(button => {
      button.classList.remove(theme)
      button.classList.add(newTheme)
    })
    console.log(theme)
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