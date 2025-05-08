import { nanoid } from "nanoid"
import dayjs from "dayjs"
import React, { JSX } from "react"
import { Navigate } from "react-router-dom"

import GameOver from "./GameOver"

import convertToMiles from '../util/convertToMiles.ts'
import breakCategory from '../util/breakCategory.ts'

interface Country {
  id: number,
  name: string,
  population: number,
  area: number
}

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

  const [answerNodes, setAnswerNodes] = React.useState<string[]>([])

  // Contains an object array with the names and values of all previous guesses and answers
  interface AnswersLog {
    type: string,
    size: string,
    prevGuessName: string,
    prevGuessValue: number,
    prevAnswerName: string,
    prevAnswerValue: number
  }
  const [answersLog, setAnswersLog] = React.useState<AnswersLog[]>([])

  interface AnswerStats {
    highpopulation: {Q: number, A: number},
    lowpopulation:  {Q: number, A: number},
    higharea:  {Q: number, A: number},
    lowarea:  {Q: number, A: number},
  }
  const [answerStats, setAnswerStats] = React.useState<AnswerStats>({
    highpopulation: { Q: 0, A: 0 },
    lowpopulation: { Q: 0, A: 0 },
    higharea: { Q: 0, A: 0 },
    lowarea: { Q: 0, A: 0 }
  })

  // Contains the HTML for the previous questions guess and answer
  const [recap, setRecap] = React.useState<JSX.Element>()

  // Handles the game active status, used for triggering things when the game starts/ends
  const [gameOver, setGameOver] = React.useState(false)

  const categories = [
    'high-population',
    'low-population',
    'high-area',
    'low-area'
  ]

  // Grabs the current page theme so it can be applied to the answer buttons
  const currentTheme = localStorage.getItem('theme') || 'blue'

  // Selects the question category
  function generateCategory() {
    // Selects the category at random
    const categoryNum = Math.floor(Math.random() * categories.length)
    // Appends a unique ID so that if the same category is picked twice in a row it will still trigger the useEffect
    const categoryID = `${categories[categoryNum]}-${Date.now()}`
    setCategory([...category, categoryID])
  }

  // Generates a new question when the category is selected
  const firstRender = React.useRef(true)
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      generateCategory()
    } else {
      generateQuestion()
      setRecap(generateRecap())
    }

  },[category])

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
          <div className={`answers__option ${currentTheme}`} key={nanoid()}>
            <button
              disabled = {!gameOver ? false : true}
              className='answers__button'
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

  // Determines the answer based on the category
  function generateAnswer(category: string, countryAnswers: Country[]) {
    const [type, size] = breakCategory(category)
    let valArray: number[] = []
    let answer: number = 0

    countryAnswers.forEach((country) => {
      if (type === 'area' || type === 'population') {
        valArray.push(country[type])
      }
    })
    size === 'high'
        ? answer = Math.max(...valArray)
        : answer = Math.min(...valArray)
    return answer
  }

  // The onClick function for the four answer buttons
  // Determines whether to award a point based on the users selected answer, increments round counter
  function answerCheck(category: string, answer: number, country: Country, countryAnswers: Country[]) {
    const [type, size] = breakCategory(category)

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
    const answerCorrect = document.querySelector('.answers__correct')
    if (answer && answer === country[type]) {
      answerCorrect?.classList.add('opacity')
      setTimeout(() => {
        answerCorrect?.classList.remove('opacity')
      },1500)
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
    setPrevGuess(country)
    // Generates the category for the next round (useEffect triggers the next question to also generate)
    generateCategory()
    setRound(prev => prev + 1)
  }

  function generateAnswerNodes() {
    return answerNodes.map(node => {
      return (
        <span key={nanoid()} className={`node--${node}`}></span>
      )
    })
  }

  // Generates the recap for the previous question, shows the correct answer and the guessed answer
  function generateRecap() {
    if (category.length > 1) {
      // Grabs some values from the previous quesiton
      const [type, size] = breakCategory(category[category.length - 2])

      const prevGuessName: string = prevGuess
        ? prevGuess.name
        : ''
      let prevGuessValue: number

      const prevAnswerName = prevAnswer
      ? prevAnswer.name
      : ''
      let prevAnswerValue: number

      // Sets the answer node for the previous question (the little red or green ball)
      if (round !== 1) {
        if (prevGuessName === prevAnswerName) {
          setAnswerNodes(prev => [...prev, 'green'])
        } else {
          setAnswerNodes(prev => [...prev, 'red'])
        }
      }

      // Grab the category values from the previous guess/answer, save all values in the answers log, generate and return the HTML for the previous question recap
      prevGuess
      ? prevGuessValue = prevGuess[type]
      : prevGuessValue = 0
      prevAnswer
      ? prevAnswerValue = prevAnswer[type]
      : prevAnswerValue = 0
      setAnswersLog([...answersLog, {
        type, size,
        prevGuessName, prevGuessValue,
        prevAnswerName, prevAnswerValue
      }])

      if (type === 'area' && prevGuess && prevAnswer) {
        return (
          <div className={prevGuessName === prevAnswerName ? 'recap--correct' : 'recap--incorrect'}>
            <p>You picked: {prevGuessName} - {prevGuessValue.toLocaleString()}km² ({convertToMiles(prevGuess.area)}mi²)</p>
            <p>Correct answer: {prevAnswerName} - {prevAnswerValue.toLocaleString()}km² ({convertToMiles(prevAnswer.area)}mi²)</p>
          </div>
        )
      } else if (type === 'population' && prevGuess && prevAnswer) {
        return (
          <div className={prevGuessName === prevAnswerName ? 'recap--correct' : 'recap--incorrect'}>
            <p>You picked: {prevGuessName} (Population: {prevGuessValue.toLocaleString()})</p>
            <p>Correct answer: {prevAnswerName} (Population: {prevAnswerValue.toLocaleString()})</p>
          </div>
        )
      } else console.error('prevGuess or prevAnswer undefined!')
    }
  }

  // Generates the question title based on the category selected
  function generateTitle() {
    if (category.length > 0) {
      const [type, size] = breakCategory(category[category.length - 1])
      const typeText = type === 'population' ? 'population' : 'land area'
      const sizeText = size === 'high' ? 'largest' : 'smallest'
      return <h2 className="play-game__question">Guess the country with the <i>{sizeText} {typeText}</i>!</h2>
    }
  }

  function endMatch() {
    setGameOver(true)
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
    setGameOver(false)
    generateCategory()
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

  // Functionality for the resign button
  function resign() {
    setGameOver(true)
    endMatch()
  }

  // When true (game has ended) regenerates the question buttons so that disabled = true
  // When false (new game started) refreshes the answers log
  React.useEffect(() => {
    if (gameOver) {
      generateQuestion()
    } else {
      setAnswersLog([])
    }
  },[gameOver])
  
  if (countryData.length > 0) {
    return (
      <div className="play-game">
        {generateTitle()}
        <p className="play-game__progress">Question {round}/{gameLength}</p>
        <div className="answers">
          {displayData}
        </div>
        <div className="answers__correct-div">
          <p className="answers__correct">CORRECT!</p>
        </div>

        <div className="scoreboard">
          <p>Score: {score}</p>
          <p>Highscore: {highscore}</p>
        </div>

        {!gameOver && <button
          className={`button ${currentTheme}`}
          onClick={resign}
        >Resign</button>}

        {gameOver && <button
          className={`button ${currentTheme}`}
          onClick={resetGame}
        >Play Again</button>}

        <div className="nodes">
          {generateAnswerNodes()}
        </div>

        {answersLog.length > 0 && recap}

        <GameOver
          answersLog={answersLog}
          answerStats={answerStats}
          score={score}
        />
      </div>
    )
    // Returns user to the Home page if the page loads before the API has finished loading (happens if you refresh on /play)
  } else {
    return <Navigate to='/' />
  }

}