import { useNavigate } from "react-router-dom"

export default function Home() {
  
  // Grabs the current page theme so it can be applied to the answer buttons
  const currentTheme = localStorage.getItem('theme') || 'blue'

  let navigate = useNavigate()

  function scrollToTop() {
    window.scrollTo({
      top: 0
    });
  }

  function viewPage(page: string) {
    navigate(`/${page}`)
    scrollToTop()
  }

  return (
    <div className="home">
      <h1>Sean's Country Quiz</h1>
      <p>This is a simple quiz intended to test your knowledge of different countries from around the world</p>
      <p>Big small </p>
      <button
        title="Start Game"
        className={`button button__stats ${currentTheme}`}
        onClick={() => viewPage('play')}
        >Start Game
      </button>
      <button
        title="View Stats"
        className={`button button__stats ${currentTheme}`}
        onClick={() => viewPage('stats')}
        >View Stats
      </button>

      <h2>Controls & Accessibility</h2>
      <p>ESC - Resign</p>
      <p>Enter - Start Game</p>
      <p>A B C D 1 2 3 4</p>
      <p>You can modify the colour scheme of the website itself, as well as the colours for correct/incorrect guesses by using the theme selector at the top right of the page</p>
    </div>
  )
}