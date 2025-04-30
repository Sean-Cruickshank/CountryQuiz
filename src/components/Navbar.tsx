interface NavbarProps {
  selectTheme: (data: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function Navbar({ selectTheme }: NavbarProps) {

  return (
    <nav>
      <select onChange={selectTheme}>
        <option value='blue'>Blue</option>
        <option value='yellow'>Yellow</option>
        <option value='pink'>Pink</option>
        <option value='teal'>Teal</option>
      </select>
    </nav>
  )
}