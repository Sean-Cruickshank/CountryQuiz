import { nanoid } from "nanoid"
import { useNavigate, useOutletContext } from "react-router-dom"
import Confetti from 'react-confetti'
import { IoIosCloseCircle } from "react-icons/io";

import Log from "./Log.tsx"

import { AnswersLog, AnswerStats } from "../util/interfaces.ts"
import generateUnit from "../util/generateUnit.tsx";
import { generateMeter } from "../util/generateMeter.tsx"
import generateWaveEffect from "../util/generateWaveEffect.tsx"
import React from "react"

interface GameOverProps {
  gameLength: number,
  answersLog: AnswersLog[],
  answerStats: AnswerStats,
  score: number,
  highscore: number,
  resetGame: () => void,
  panelActive: boolean,
  setPanelActive: React.Dispatch<React.SetStateAction<boolean>>
}

export default function GameOver({ gameLength, answersLog, answerStats, score, highscore, resetGame, panelActive, setPanelActive}: GameOverProps) {
  const allThemes = ['rgb(100, 100, 200)', 'rgb(212, 212, 90)','rgb(100, 200, 100)','rgb(212, 150, 90)','rgb(200, 100, 100)','rgb(100, 200, 162)','rgb(162, 80, 200)']
  
  const context: {theme: string, indicator: string, unit: string} = useOutletContext()

  const preferences = {
    theme : context ? context.theme : 'blue',
    indicator : context ? context.indicator : 'greenred',
    unit : context ? context.unit : 'metric'
  }

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
      ? classname = `${preferences.indicator} log__guess log__guess--correct`
      : classname = `${preferences.indicator} log__guess log__guess--incorrect`
    if (answersLog.length > 0) {
      let logGuess, logAnswer

      if (question.type === 'population') {
        logGuess = `${question.prevGuessName} - ${question.prevGuessValue.toLocaleString()}`
        logAnswer = `${question.prevAnswerName} - ${question.prevAnswerValue.toLocaleString()}`
      }

      if (question.type === 'area') {
        logGuess = `${question.prevGuessName} - ${generateUnit(question.prevGuessValue, preferences.unit)}`
        logAnswer = `${question.prevAnswerName} - ${generateUnit(question.prevAnswerValue, preferences.unit)}`
      }
      questionCount++

      return (
        <tr className='log__entry' key={nanoid()}>
          <td>#{questionCount}</td>
          <td>{titleCase(question.size)} {titleCase(question.type)}:</td>
          <td className={classname}>{question.prevGuessName === 'No Answer'
            ? `${question.prevGuessName}`
            : logGuess
          }</td>
          <td>{logAnswer}</td>
        </tr>
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

    if (effect !== 'none') return generateWaveEffect(message, effect)
    else return <b>{message}</b>
  }

  if (panelActive) return (
    <div className="gameover">
      {scorePercent === 100 && <Confetti width={1920} height={window.innerHeight} colors={allThemes} />}
      <div className="gameover__popup">
      </div>
      <div className={`panel gameover__panel ${preferences.theme}`}>
        <div
          className="gameover__close"
          onClick={() => setPanelActive(false)}
        ><IoIosCloseCircle /></div>

        <h2 className="gameover__title" id="gameover__title">Game Over!</h2>
        <p>You got {score} out of {gameLength} questions correct! ({scorePercent}%)</p>
        <div className="gameover__end-message">{generateEndMessage()}</div>
        
        <div>
          {generateMeter('High Population', answerStats.highpopulation.Q, answerStats.highpopulation.A)}
          {generateMeter('Low Population', answerStats.lowpopulation.Q, answerStats.lowpopulation.A)}
          {generateMeter('High Area', answerStats.higharea.Q, answerStats.higharea.A)}
          {generateMeter('Low Area', answerStats.lowarea.Q, answerStats.lowarea.A)}
        </div>

        <div className="gameover__buttons">
          <button
            title="New Game"
            className={`button ${preferences.theme}`}
            onClick={() => viewPage('start')}
          >New Game</button>

          <button
            title="Play Again"
            className={`button button__play-again ${preferences.theme}`}
            onClick={resetGame}
          >Play Again</button>

          <button
            title="View Stats"
            className={`button button__stats ${preferences.theme}`}
            onClick={() => viewPage('stats')}
            >View Stats</button>
        </div>
      </div>
      {answersLog.length > 0 &&
        <Log
          pageTitles={['Question', 'Category', 'You Guessed', 'Correct Answer']}
          pageContent={logHTML}
          lastPage={Math.ceil(answersLog.length / 10)}
        />}
    </div>
  )
}