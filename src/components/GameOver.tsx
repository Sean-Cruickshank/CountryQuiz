import { nanoid } from "nanoid"

import convertToMiles from '../util/convertToMiles.ts'
import { Link } from "react-router-dom"

interface AnswersLog {
  type: string,
  size: string,
  prevGuessName: string,
  prevGuessValue: number,
  prevAnswerName: string,
  prevAnswerValue: number
}

interface AnswerStats {
  highpopulation: {Q: number, A: number},
  lowpopulation:  {Q: number, A: number},
  higharea:  {Q: number, A: number},
  lowarea:  {Q: number, A: number},
}

interface GameOverProps {
  answersLog: AnswersLog[],
  answerStats: AnswerStats,
  score: number
}

export default function GameOver({ answersLog, answerStats, score}: GameOverProps) {
  
  // Grabs the current page theme so it can be applied to the answer buttons
  const currentTheme = localStorage.getItem('theme') || 'blue'
  
  function titleCase(string: string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase()
  }
  
  // Generates the HTML for the Answers Log
  const generateLog = answersLog.map((question) => {
    let classname = ''
    question.prevGuessName === question.prevAnswerName
      ? classname = "answers-log__entry--green"
      : classname = "answers-log__entry--red"
    if (answersLog.length > 0) {
      if (question.type === 'population') {
        return (
          <div className={classname} key={nanoid()}>
            <p>{titleCase(question.size)} {titleCase(question.type)}:</p>
            <p>{question.prevGuessName} - {question.prevGuessValue.toLocaleString()}</p>
            <p>{question.prevAnswerName} - {question.prevAnswerValue.toLocaleString()}</p>
          </div>
        )
      } else {
        return (
          <div className={classname} key={nanoid()}>
            <p>{titleCase(question.size)} {titleCase(question.type)}:</p>
            <p>{question.prevGuessName} - {question.prevGuessValue.toLocaleString()}km² ({convertToMiles(question.prevGuessValue)}mi²)</p>
            <p>{question.prevAnswerName} - {question.prevAnswerValue.toLocaleString()}km² ({convertToMiles(question.prevAnswerValue)}mi²)</p>
          </div>
        )
      }
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

  return (
    <div className="gameover hidden">
      <h2 className="gameover__title" id="gameover__title">Game Over!</h2>
      <p>You got {score} out of {answersLog.length} questions correct!</p>
      {generateStats()}
      <Link
        className={`button button__stats ${currentTheme}`}
        to='/stats'>View Stats
      </Link>
      <div className="answers-log">
        {answersLog.length > 0 && <div className="gameover__subheaders">
          <h3>Category:</h3>
          <h3>You Guessed:</h3>
          <h3>Correct Answer:</h3>
        </div>}
        {generateLog}
      </div>
    </div>
  )
}