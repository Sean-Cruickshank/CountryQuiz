import { nanoid } from "nanoid"
import convertToMiles from '../util/convertToMiles.ts'
import { useNavigate } from "react-router-dom"
import { AnswersLog, AnswerStats } from "../util/interfaces.ts"
import Confetti from 'react-confetti'
import Pagination from "./Pagination.tsx"

interface GameOverProps {
  gameLength: number,
  answersLog: AnswersLog[],
  answerStats: AnswerStats,
  score: number,
  highscore: number,
  resetGame: () => void
}

export default function GameOver({ gameLength, answersLog, answerStats, score, highscore, resetGame}: GameOverProps) {
  
  // Grabs the current page theme so it can be applied to the answer buttons
  const currentTheme = localStorage.getItem('theme') || 'blue'

  const allThemes = ['rgb(100, 100, 200)', 'rgb(212, 212, 90)','rgb(100, 200, 100)','rgb(212, 150, 90)','rgb(200, 100, 100)','rgb(100, 200, 162)','rgb(162, 80, 200)']

  // Grabs the current indicator so it can be applied to the nodes
  const currentIndicator = localStorage.getItem('indicator') || 'greenred'

  let scorePercent = Number(((score / gameLength) * 100).toFixed(2)) || 0
  
  function titleCase(string: string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase()
  }

  let navigate = useNavigate()
  function viewPage(page: string) {
      navigate(`/${page}`)
      window.scrollTo({
        top: 0
      });
  }
  
  // Generates the HTML for the Answers Log
  let questionCount = 0
  const logHTML = answersLog.map((question) => {
    let classname = ''
    question.prevGuessName === question.prevAnswerName
      ? classname = `${currentIndicator} log__entry log__entry--correct`
      : classname = `${currentIndicator} log__entry log__entry--incorrect`
    if (answersLog.length > 0) {
      let logGuess, logAnswer

      if (question.type === 'population') {
        logGuess = `${question.prevGuessName} - ${question.prevGuessValue.toLocaleString()}`
        logAnswer = `${question.prevAnswerName} - ${question.prevAnswerValue.toLocaleString()}`
      }

      if (question.type === 'area') {
        logGuess = `${question.prevGuessName} - ${question.prevGuessValue.toLocaleString()}km² (${convertToMiles(question.prevGuessValue)}mi²)`
        logAnswer = `${question.prevAnswerName} - ${question.prevAnswerValue.toLocaleString()}km² (${convertToMiles(question.prevAnswerValue)}mi²)`
      }
      questionCount++

      return (
        <div className={classname} key={nanoid()}>
          <p>#{questionCount}</p>
          <p>{titleCase(question.size)} {titleCase(question.type)}:</p>
          <p>{question.prevGuessName === 'No Answer'
            ? `${question.prevGuessName}`
            : logGuess
          }</p>
          <p>{logAnswer}</p>
        </div>
      )
    }
  })

  // Generates the HTML for the stats overview
  function generateStats() {
    let highPopulation, lowPopulation, highArea, lowArea
    // Sets the percentage of questions scored correctly per category
    // Defaults to 0 if no questions have been asked to avoid dividing by 0
    answerStats.highpopulation.Q > 0
      ? highPopulation = answerStats.highpopulation.A / answerStats.highpopulation.Q
      : highPopulation = 0

      answerStats.lowpopulation.Q > 0
      ? lowPopulation = answerStats.lowpopulation.A / answerStats.lowpopulation.Q
      : lowPopulation = 0

      answerStats.higharea.Q > 0
      ? highArea = answerStats.higharea.A / answerStats.higharea.Q
      : highArea = 0

      answerStats.lowarea.Q > 0
      ? lowArea = answerStats.lowarea.A / answerStats.lowarea.Q
      : lowArea = 0

      function formatStats(stat: number): string {
        return (stat * 100).toFixed(0)
      }

    return (
      <div>
        <div className="gameover__category">
         <p>High Population: {formatStats(highPopulation)}% ({answerStats.highpopulation.A}/{answerStats.highpopulation.Q})</p>
          <meter
            className={`gameover__meter ${currentTheme}`}
            value={formatStats(highPopulation)} max='100'
          ></meter>
        </div>

        <div className="gameover__category">
          <p>Low Population: {formatStats(lowPopulation)}% ({answerStats.lowpopulation.A}/{answerStats.lowpopulation.Q})</p>
          <meter
            className={`gameover__meter ${currentTheme}`}
            value={formatStats(lowPopulation)} max='100'
          ></meter>
        </div>

        <div className="gameover__category">
          <p>High Area: {formatStats(highArea)}% ({answerStats.higharea.A}/{answerStats.higharea.Q})</p>  
          <meter
            className={`gameover__meter ${currentTheme}`}
            value={formatStats(highArea)} 
            max='100'
          ></meter>
        </div>

        <div className="gameover__category">
          <p>Low Area: {formatStats(lowArea)}% ({answerStats.lowarea.A}/{answerStats.lowarea.Q})</p>
          <meter
          className={`gameover__meter ${currentTheme}`}
          value={formatStats(lowArea)}
          max='100'
        ></meter>
        </div>
      </div>
    )
  }

  // Generates the message at the end of the match based on the user's score percentage
  function generateEndMessage() {
    const lsHistory = localStorage.getItem('history')
    const playerHistory = lsHistory !== null ? JSON.parse(lsHistory) : []
    
    let message
    let effect = 'none'
    if (answersLog.length < 5) message = "You can alter your game settings by clicking the 'New Game' button!"
    else if (playerHistory.length === 1) {
      if (scorePercent === 100) {
        message = "A perfect first game! You must be good at this!"
        effect = 'perfectgame'
      }
      else if (scorePercent < 100 && scorePercent >= 80) message = "What an incredible first game!"
      else if (scorePercent < 80 && scorePercent >= 50) message = "That was a great first game!"
      else if (scorePercent < 50) message = "That's a solid effort for your first game!"
    }
    else if (scorePercent === 100) {
      message = "That's a perfect score!"
      effect = 'perfectgame'
    }
    else if (score >= highscore) {
      message = "That's a new highscore!"
      effect = 'highscore'
    }
    else if (scorePercent < 100 && scorePercent >= 80) message = "That's a great score!"
    else if (scorePercent < 80 && scorePercent >= 50) message = "Nice effort!"
    else if (scorePercent < 50) message = "Nice effort!"

    if (effect === 'none') {
      return <p className="gameover__message">{message}</p>
    } else {
      let position = 1
      let messageSpan = message?.split('').map(letter => {
        position !== 6 ? position++ : position = 1
        if (letter === ' ') return <span className={`pos-${position}`}>&nbsp;</span>
        else return <span className={`pos-${position}`}>{`${letter}`}</span>
      })
      return <div className={`gameover__message gameover__message--${effect}`}>{messageSpan}</div>
    }
  }

  return (
    <div className="gameover">
      {scorePercent === 100 && <Confetti width={1920} height={window.innerHeight} colors={allThemes} />}
      <div className="gameover__popup">
        <div className="gameover__details">
          <h2 className="gameover__title" id="gameover__title">Game Over!</h2>
          <p>You got {score} out of {gameLength} questions correct! ({scorePercent}%)</p>
          {generateEndMessage()}
          {generateStats()}

          <div className="gameover__buttons">
            <button
              title="New Game"
              className={`play-again-button button ${currentTheme}`}
              onClick={() => viewPage('start')}
            >New Game</button>

            <button
              title="Play Again"
              className={`play-again-button button ${currentTheme}`}
              onClick={resetGame}
            >Play Again</button>

            <button
              title="View Stats"
              className={`button button__stats ${currentTheme}`}
              onClick={() => viewPage('stats')}
              >View Stats</button>
          </div>
        </div>
      </div>
      {answersLog.length > 0 && <div className="log">
        <div className="log__subheaders">
          <h3>Question:</h3>
          <h3>Category:</h3>
          <h3>You Guessed:</h3>
          <h3>Correct Answer:</h3>
        </div>
        <Pagination lastPage={Math.ceil(answersLog.length / 10)} pageContent={logHTML} />
      </div>}
    </div>
  )
}