import { Outlet } from "react-router-dom"

import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout() {
  return (
    <div className='layout'>
      <Navbar />
      <div className='layout-outlet'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}