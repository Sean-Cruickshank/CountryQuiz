import { nanoid } from "nanoid"
import dayjs from "dayjs"
import React, { JSX } from "react"
import { Navigate } from "react-router-dom"

import GameOver from "./GameOver"
import Recap from "./Recap.tsx"

import breakCategory from '../util/breakCategory.ts'
import useEffectOnUpdate from "../util/useEffectOnUpdate.ts"

import generateTitle from "../util/generateTitle.tsx"
import generateCategory from "../util/generateCategory.tsx"
import generateAnswer from "../util/generateAnswer.tsx"
import { generateAnswerNodes, updateAnswerNodes } from "../util/answerNodes.tsx"

import { Country, AnswersLog, AnswerStats } from "../util/interfaces.ts"

interface PlayGameProps {
  countryData: Country[]
}

export default function PlayGame({ countryData }: PlayGameProps) {
  // Contains the HTML for the four answer buttons
  const [displayData, setDisplayData] = React.useState<JSX.Element[]>([])

  const [score, setScore] = React.useState(0)

  const lsHighscore = localStorage.getItem('highscore')
  const [highscore, setHighscore] = React.useState(lsHighscore !== null ? JSON.parse(lsHighscore) : 0)
  React.useEffect(() => {
    localStorage.setItem('highscore', JSON.stringify(highscore))
  },[highscore])

  const [round, setRound] = React.useState(1)
  let gameLength = 10
  React.useEffect(() => {
    if (round > gameLength) {
      setRound(gameLength)
      endMatch()
    }
  },[round])

  // Contains an array of all category IDs for that match
  const [category, setCategory] = React.useState<string[]>([])

  // Contains the country object for the previous questions guess
  const [prevGuess, setPrevGuess] = React.useState<Country>()

  // Contains the country object for the previous questions answer
  const [prevAnswer, setPrevAnswer] = React.useState<Country>()
  const [prevAnswers, setPrevAnswers] = React.useState<Country[]>()

  const [answerNodes, setAnswerNodes] = React.useState<string[]>([])

  // Contains an object array with the names and values of all previous guesses and answers
  const [answersLog, setAnswersLog] = React.useState<AnswersLog[]>([])

  const [answerStats, setAnswerStats] = React.useState<AnswerStats>({
    highpopulation: { Q: 0, A: 0 },
    lowpopulation: { Q: 0, A: 0 },
    higharea: { Q: 0, A: 0 },
    lowarea: { Q: 0, A: 0 }
  })

  // Handles the game active status, used for triggering things when the game starts/ends
  const [gameActive, setGameActive] = React.useState(true)

  // Grabs the current page theme so it can be applied to the answer buttons
  const currentTheme = localStorage.getItem('theme') || 'blue'

  // Generates a new question when the category is selected
  function categoryOnUpdate() {
    generateQuestion()
    updateAnswerNodes(round, setAnswerNodes, prevGuess, prevAnswer)
  }
  // Custom useEffect for skipping the first render
  useEffectOnUpdate(categoryOnUpdate, [category])

  // Enables keyboard functionality for the answer buttons, the resign button, and the play again button
  React.useEffect(() => {
    setCategory(generateCategory(category))
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'a' || event.key === 'A' || event.key === '1') {
        let element: HTMLElement | null = document.querySelector('.answer__button-A')
        element?.click()
      }
      if (event.key === 'b' || event.key === 'B' || event.key === '2') {
        let element: HTMLElement | null = document.querySelector('.answer__button-B')
        element?.click()
      }
      if (event.key === 'c' || event.key === 'C' || event.key === '3') {
        let element: HTMLElement | null = document.querySelector('.answer__button-C')
        element?.click()
      }
      if (event.key === 'd' || event.key === 'D' || event.key === '4') {
        let element: HTMLElement | null = document.querySelector('.answer__button-D')
        element?.click()
      }
      if (event.key === 'Enter') {
        let element: HTMLElement | null = document.querySelector('.play-again-button')
        element?.click()
      }
      if (event.key === 'Escape') {
        let element: HTMLElement | null = document.querySelector('.resign-button')
        element?.click()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  },[])

  function generateQuestion() {
    let countryAnswers: Country[] = []
    if (countryData.length > 0) {
      // Selects four countries at random from the array
      while (countryAnswers.length < 4) {
        const num = Math.floor(Math.random() * countryData.length)
        const country = countryData[num]
        // Filters out any duplicate answers
        const compare = countryAnswers.some((item) => {
          return country === item
        })
        if (!compare) {
          countryAnswers.push(country)
        }
      }

      const answer = generateAnswer(category[category.length - 1], countryAnswers)
    
      // Generates the HTML for the four answers
      const alpha = ['A','B','C','D']
      let index = 0
      const countryAnswersHTML = countryAnswers.map((country) => {
        index++
        return (
          <div
            className={`answers__option ${currentTheme} ${!gameActive && 'disabled'}`}
            key={nanoid()}
          >
            <button
              title={country.name}
              disabled = {gameActive ? false : true}
              className={`answers__button answer__button-${alpha[index - 1]}`}
              onClick={() => answerCheck(category[category.length - 1], answer, country, countryAnswers)}
            >
              <div className="answers__button__alpha">{alpha[index - 1]}</div>
              <div className="answers__button__text">{country.name}</div>
            </button>
          </div>
        )
      })
      setDisplayData(countryAnswersHTML)
    }
  }

  // The onClick function for the four answer buttons
  // Determines whether to award a point based on the users selected answer, increments round counter
  function answerCheck(categoryString: string, answer: number, country: Country, countryAnswers: Country[]) {
    const [type, size] = breakCategory(categoryString)

    let sizetype: keyof AnswerStats
    if ((size === 'high' || size === 'low') && (type === 'area' || type === 'population')) {
      sizetype = `${size}${type}`
    } else {
      sizetype = 'highpopulation'
    }

    // If the answer matches the category value for the country selected (correct answer)
    //    Add a point to the score
    //    Add a point to the Q and the A tally for the respective     category in AnswerStats
    // Otherwise just add a point to the Q tally (incorrect answer)
    if (answer && answer === country[type]) {
      setScore(prev => prev + 1)
      setAnswerStats({
        ...answerStats,
        [sizetype]: {Q: answerStats[sizetype].Q + 1, A: answerStats[sizetype].A + 1}
      })

    } else {
      setAnswerStats({
        ...answerStats,
        [sizetype]: {...answerStats[sizetype], Q: answerStats[sizetype].Q + 1}
      })
    }

    // Grabs the corresponding country for the correct answer and saves it to state, also saves the guessed country to state
    const answerCountry = countryAnswers.find((country) => {
      return country[type] === answer
    })
    setPrevAnswer(answerCountry)
    setPrevAnswers(countryAnswers)
    setPrevGuess(country)
    // Generates the category for the next round (useEffect triggers the next question to also generate)
    setCategory(generateCategory(category))
    setRound(prev => prev + 1)
  }

  function endMatch() {
    setGameActive(false)
    console.log('Game over!')
    const lsHistory = localStorage.getItem('history')
    const playerHistory = lsHistory !== null ? JSON.parse(lsHistory) : []
    playerHistory.push({
      id: nanoid(),
      score,
      gameLength,
      date: dayjs().format('D MMMM YYYY h:mma'),
      answerStats
    })
    localStorage.setItem('history', JSON.stringify(playerHistory))

    if (score > highscore) {
      setHighscore(score)
    }
    document.querySelector('.gameover')?.classList.remove('hidden')
    // document.getElementById('gameover__title')?.scrollIntoView({behavior: "smooth"})
  }

  // Resets all stats when a new game is started
  // Passed as a prop to GameOver for the "Play Again" button
  function resetGame(): void {
    setGameActive(true)
    setCategory(generateCategory(category))
    setAnswerStats({
      highpopulation: { Q: 0, A: 0 },
      lowpopulation: { Q: 0, A: 0 },
      higharea: { Q: 0, A: 0 },
      lowarea: { Q: 0, A: 0 }
    })
    setScore(0)
    setRound(1)
    setAnswerNodes([])
    document.querySelector('.gameover')?.classList.add('hidden')
  }

  // When true (game has ended) regenerates the question buttons so that disabled = true
  // When false (new game started) refreshes the answers log
  React.useEffect(() => {
    if (gameActive) {
      setAnswersLog([])
    } else {
      generateQuestion()
    }
  },[gameActive])
  
  if (countryData.length > 0) {
    return (
      <div className="play-game">
        <p
          className={`play-game__progress ${currentTheme}`}
        >Question {round}/{gameLength}</p>
        <h2
          className={`play-game__question ${currentTheme}`}
        >{generateTitle(1, category)}</h2>
        
        <div className="answers">
          {displayData}
        </div>
        
        <div className="scoreboard">
          <p>Score: {score}</p>
          <p>Highscore: {highscore}</p>
        </div>

        {gameActive && <button
          title="Resign"
          className={`resign-button button ${currentTheme}`}
          onClick={() => {setGameActive(false); endMatch()}}
        >Resign</button>}

        {!gameActive && <button
          title="Play Again"
          className={`play-again-button button ${currentTheme}`}
          onClick={resetGame}
        >Play Again</button>}

        <div className="nodes">
          {generateAnswerNodes(answerNodes)}
        </div>

        <Recap
          category={category}
          currentTheme={currentTheme}
          prevGuess={prevGuess}
          prevAnswer={prevAnswer}
          prevAnswers={prevAnswers}
          answersLog={answersLog}
          setAnswersLog={setAnswersLog}
        />

        <GameOver
          answersLog={answersLog}
          answerStats={answerStats}
          score={score}
        />
      </div>
    )
  } else {
    return <Navigate to='/' />
  }
}