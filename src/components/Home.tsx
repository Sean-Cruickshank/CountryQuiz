import { useNavigate, useOutletContext } from "react-router-dom"
import { FaPalette } from "react-icons/fa";

export default function Home() {

  const context: {theme: string, indicator: string, unit: string} = useOutletContext()
  
  const preferences = {
    theme : context ? context.theme : 'blue',
    indicator : context ? context.indicator : 'greenred',
    unit : context ? context.unit : 'metric'
  }

  let navigate = useNavigate()
  
  function viewPage(page: string) {
    navigate(`/${page}`)
    window.scrollTo({
        top: 0
    });
  }

  return (
    <div className={`home ${preferences.theme}`}>
      <img src="/images/home_answertags.png" />
      <div className="home__text-container">
        <h1>How to play</h1>
        <p>This is a simple quiz intended to test your knowledge of different countries from around the world!</p>
        <p>All you need to do is find the country with the largest, or smallest <span>size</span> or <span>population</span></p>
        <p>For every question you will be given four options to choose from</p>
        <p>Correctly pick the country that matches the criteria to score points!</p>
        <button
          title="New Game"
          className={`button button__stats ${preferences.theme}`}
          onClick={() => viewPage('start')}
          >New Game
        </button>
      </div>

      <div className="home__text-container">
        <h1>Statistics</h1>
        <p>Match history as well as lifetime statistics can be viewed on the Stats page!</p>
        <p>Compare your results over time and see which category you know best</p>
        <p>This information is stored locally on your browser and is not visible to other users</p>
        <button
          title="View Stats"
          className={`button button__stats ${preferences.theme}`}
          onClick={() => viewPage('stats')}
          >View Stats
        </button>
      </div>

      <div className="home__text-container">
        <h1>Controls & Accessibility</h1>
        <p>The following shortcuts can be used to to interact with the quiz via keyboard</p>
        <div className="home__controls">
          <div className="home__controls--A">
            <p>N - New Game</p>
            <p>S - View Stats</p>
            <p>H - View Home</p>
          </div>
          <div className="home__controls--B">
            <p>A or 1 - Answer A</p>
            <p>B or 2 - Answer B</p>
            <p>C or 3 - Answer C</p>
            <p>D or 4 - Answer D</p>
          </div>
          <div className="home__controls--B">
            <p>ESC - Resign</p>
            <p>P - Play Again</p>
          </div>
        </div>
        <p>You can modify the colour scheme of the website itself, as well as the colours for correct/incorrect guesses by using the theme selector <FaPalette /> at the top of the page</p>
      </div>

      <div className="home__text-container">
        <h1>Feedback</h1>
        <p>Feedback is always appreciated. If you have any suggestions, recommendations, or just want to share your thoughts on this project I would love to hear it!</p>
        <p>I can be reached <a href="mailto:seancruickshank2025@gmail.com">by email</a> or in several other ways that should all be listed <a target="_blank" href="https://www.seancruickshank.co.nz">here</a></p>
        <p>Thank you for visiting my website</p>
      </div>
    </div>
  )
}