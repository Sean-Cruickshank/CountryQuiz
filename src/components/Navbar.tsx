import React from "react"

interface NavbarProps {
  selectTheme: (data: string) => void
}

export default function Navbar({ selectTheme }: NavbarProps) {

  // const currentTheme = localStorage.getItem('theme') || 'blue'

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

  function dropdownSelect(colour: string) {
    selectTheme(colour)
    setToggle(prev => !prev)
  }
  
  return (
    <nav>
      {/* <select defaultValue={currentTheme} onChange={selectTheme}>
        <option value='blue'>Blue</option>
        <option value='yellow'>Yellow</option>
        <option value='pink'>Pink</option>
        <option value='teal'>Teal</option>
      </select> */}
      <img
        width='40px'
        src="/images/themepicker.png"
        className="theme__icon"
        onClick={() => setToggle(prev => !prev)}
      />
      <div className="theme__dropdown">
        <a onClick={() => dropdownSelect('blue')}>Blue</a>
        <a onClick={() => dropdownSelect('yellow')}>Yellow</a>
        <a onClick={() => dropdownSelect('pink')}>Pink</a>
        <a onClick={() => dropdownSelect('teal')}>Teal</a>
      </div>
      <div onClick={() => setToggle(prev => !prev)} className="theme__background"></div>
    </nav>
  )
}