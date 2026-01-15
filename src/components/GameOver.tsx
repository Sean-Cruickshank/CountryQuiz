import { nanoid } from "nanoid"
import { useNavigate, useOutletContext } from "react-router-dom"
import Confetti from 'react-confetti'

import Pagination from "./Pagination.tsx"

import { AnswersLog, AnswerStats } from "../util/interfaces.ts"
import convertToMiles from '../util/convertToMiles.ts'
import { generateMeter } from "../util/generateMeter.tsx"
import generateWaveEffect from "../util/generateWaveEffect.tsx"

interface GameOverProps {
  gameLength: number,
  answersLog: AnswersLog[],
  answerStats: AnswerStats,
  score: number,
  highscore: number,
  resetGame: () => void
}

export default function GameOver({ gameLength, answersLog, answerStats, score, highscore, resetGame}: GameOverProps) {
  const allThemes = ['rgb(100, 100, 200)', 'rgb(212, 212, 90)','rgb(100, 200, 100)','rgb(212, 150, 90)','rgb(200, 100, 100)','rgb(100, 200, 162)','rgb(162, 80, 200)']
  
  const context: {theme: string, indicator: string} = useOutletContext()
  const theme = context ? context.theme : 'blue'
  const indicator = context ? context.indicator : 'greenred'

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
      ? classname = `${indicator} log__guess log__guess--correct`
      : classname = `${indicator} log__guess log__guess--incorrect`
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
        <div className='log__entry' key={nanoid()}>
          <p>#{questionCount}</p>
          <p>{titleCase(question.size)} {titleCase(question.type)}:</p>
          <p className={classname}>{question.prevGuessName === 'No Answer'
            ? `${question.prevGuessName}`
            : logGuess
          }</p>
          <p>{logAnswer}</p>
        </div>
      )
    }
  })

  function generateEndMessage() {
    const lsHistory = localStorage.getItem('history')
    const playerHistory = lsHistory !== null ? JSON.parse(lsHistory) : []
    
    let message: string = ''
    let effect = 'none'
    if (answersLog.length < 5) message = "You can alter your game settings by clicking the 'New Game' button!"
    else if (playerHistory.length === 1) {
      if (scorePercent === 100) {
        message = "A perfect first game! You must be good at this!"
        effect = 'perfect'
      }
      else if (scorePercent < 100 && scorePercent >= 80) message = "What an incredible first game!"
      else if (scorePercent < 80 && scorePercent >= 50) message = "That was a great first game!"
      else if (scorePercent < 50) message = "That's a solid effort for your first game!"
    }
    else if (scorePercent === 100) {
      message = "That's a perfect score!"
      effect = 'perfect'
    }
    else if (score >= highscore && score !== 0) {
      message = "That's a new highscore!"
      effect = 'highscore'
    }
    else if (scorePercent < 100 && scorePercent >= 80) message = "That's a great score!"
    else if (scorePercent < 80 && scorePercent >= 50) message = "Nice effort!"
    else if (scorePercent < 50 && scorePercent > 0) message = "Good try!"
    else if (scorePercent === 0) message = "It can only get better from here!"

    return generateWaveEffect(message, effect)
  }

  return (
    <div className="gameover">
      {scorePercent === 100 && <Confetti width={1920} height={window.innerHeight} colors={allThemes} />}
      <div className="gameover__popup">
        <div className={`panel gameover__panel ${theme}`}>
          <h2 className="gameover__title" id="gameover__title">Game Over!</h2>
          <p>You got {score} out of {gameLength} questions correct! ({scorePercent}%)</p>
          {generateEndMessage()}
          <div>
            {generateMeter('High Population', answerStats.highpopulation.Q, answerStats.highpopulation.A)}
            {generateMeter('Low Population', answerStats.lowpopulation.Q, answerStats.lowpopulation.A)}
            {generateMeter('High Area', answerStats.higharea.Q, answerStats.higharea.A)}
            {generateMeter('Low Area', answerStats.lowarea.Q, answerStats.lowarea.A)}
          </div>

          <div className="gameover__buttons">
            <button
              title="New Game"
              className={`new-game-button button ${theme}`}
              onClick={() => viewPage('start')}
            >New Game</button>

            <button
              title="Play Again"
              className={`play-again-button button ${theme}`}
              onClick={resetGame}
            >Play Again</button>

            <button
              title="View Stats"
              className={`button button__stats ${theme}`}
              onClick={() => viewPage('stats')}
              >View Stats</button>
          </div>
        </div>
      </div>
      {answersLog.length > 0 && <div className={`log ${theme}`}>
        <div className="log__subheaders">
          <h3>Question:</h3>
          <h3>Category:</h3>
          <h3>You Guessed:</h3>
          <h3>Correct Answer:</h3>
        </div>
        <Pagination lastPage={Math.ceil(answersLog.length / 10)} pageContent={logHTML}/>
      </div>}
    </div>
  )
}