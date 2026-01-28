import { nanoid } from "nanoid"
import dayjs from "dayjs"
import React, { JSX } from "react"
import { Navigate, useLocation, useOutletContext } from "react-router-dom"

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
  
  const location = useLocation()

  const { gameLength, timerLength, timerActive } = location.state

  const [displayData, setDisplayData] = React.useState<JSX.Element[]>([])
  const [score, setScore] = React.useState(0)
  const lsHighscore = localStorage.getItem('highscore')
  const [highscore, setHighscore] = React.useState(lsHighscore !== null ? JSON.parse(lsHighscore) : 0)
  React.useEffect(() => {
    localStorage.setItem('highscore', JSON.stringify(highscore))
  },[highscore])

  const [round, setRound] = React.useState(1)
  React.useEffect(() => {
    if (round > gameLength) {
      setRound(gameLength)
      endMatch()
    }
  },[round])

  const [timer, setTimer] = React.useState<number>(timerLength)
  let timeoutAnswer: Country = { id: 999, name: 'No Answer', population: 99, area: 99 }

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

  const [gameActive, setGameActive] = React.useState(true)
  const [panelActive, setPanelActive] = React.useState(true)

  
  const context: {theme: string, indicator: string, unit: string, setRedirectWarning: React.Dispatch<React.SetStateAction<boolean>>} = useOutletContext()
  const preferences = {
    theme : context ? context.theme : 'blue',
    indicator : context ? context.indicator : 'greenred',
    unit : context ? context.unit : 'metric'
  }
  const setRedirectWarning = context && context.setRedirectWarning

  // Generates a new question when the category is selected
  function categoryOnUpdate() {
    generateQuestion()
    updateAnswerNodes(round, setAnswerNodes, prevGuess, prevAnswer)
    runTimer()
  }

  function runTimer() {
    setTimer(timerLength)
  }

  // Handles logic for the timer
  React.useEffect(() => {
    let interval: number | undefined = undefined
    if (timer > 0 && timerActive) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1)
      },1000)
    } else if (timer <= 0 && gameActive && timerActive) {
      clearInterval(interval)
      const answer = generateAnswer(category[category.length - 1], countryAnswers)
      answerCheck(category[category.length - 1], answer, timeoutAnswer, countryAnswers)
    }
    if (!gameActive) {
      setTimer(0)
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  },[timer])

  // Custom useEffect for skipping the first render
  useEffectOnUpdate(categoryOnUpdate, [category])

  React.useEffect(() => {
    setCategory(generateCategory(category))
  },[])

  const [countryAnswers, setCountryAnswers] = React.useState<Country[]>([])

  useEffectOnUpdate(generateQuestionHTML, [countryAnswers])

  function generateQuestionHTML() {
    const answer = generateAnswer(category[category.length - 1], countryAnswers)
    // Generates the HTML for the four answers
    const alpha = ['A','B','C','D']
    let index = 0
    const countryAnswersHTML = countryAnswers.map((country) => {
      index++
      return (
        <div
          className={`answers__option ${!gameActive && 'disabled'}`}
          key={nanoid()}
        >
          <button
            title={country.name}
            disabled = {gameActive ? false : true}
            className={`answers__button answer__button-${alpha[index - 1]}`}
            onClick={() => answerCheck(category[category.length - 1], answer, country, countryAnswers)}
          >
            <div className="answers__button__alpha">{alpha[index - 1]}</div>
            <div><p className="answers__button__text">{country.name}</p></div>
          </button>
        </div>
      )
    })
    setDisplayData(countryAnswersHTML)
  }

  function generateQuestion() {
    let tempCountryAnswers: Country[] = []
    setCountryAnswers([])
    if (countryData.length > 0) {
      // Selects four countries at random from the array
      let breakpoint = 0
      while (tempCountryAnswers.length < 4) {
        const num = Math.floor(Math.random() * countryData.length)
        const country = countryData[num]
        // Filters out any duplicate answers
        const compare = tempCountryAnswers.some((item) => {
          return country === item
        })
        if (!compare) {
          tempCountryAnswers.push(country)
        }
        breakpoint++
        if (breakpoint >= 5) break
      }
      setCountryAnswers(tempCountryAnswers)
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
    // document.querySelector('.gameover')?.classList.remove('hidden')
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
    // document.querySelector('.gameover')?.classList.add('hidden')
    window.scrollTo({
      top: 0
    });
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

  React.useEffect(() => {
    if (gameActive && round > 1) {
      setRedirectWarning(true)
    }
    if (!gameActive) {
      setRedirectWarning(false)
    }
  },[round, gameActive])
  
  if (countryData.length > 0 && location.state !== null) {
    return (
      <div className={`play-game ${preferences.theme}`}>
        <div className="play-game__progress">
          <p>Question {round}/{gameLength}</p>
          <div className="scoreboard">
            <p>Score: {score}</p>
            {highscore > 0 && <p><i>( Highscore: {highscore} )</i></p>}
          </div>
        </div>
        

        <h2
          className="play-game__question"
        >{generateTitle(1, category)}</h2>

        {timerActive && gameActive && <div className="timer">
          <p className="timer__text">{timer}</p>
          <meter
            className={`timer__meter ${preferences.theme}`}
            value={timer}
            max={timerLength}
          >{timer}</meter>
        </div>}
        
        <div className="answers">
          {displayData}
        </div>

        {!gameActive && <button
          className={`button ${preferences.theme} results__button`}
          onClick={() => setPanelActive(true)}
        >Show Results</button>}

        <div className="nodes">
          {generateAnswerNodes(answerNodes, gameLength, preferences.indicator)}
        </div>

        <Recap
          category={category}
          prevGuess={prevGuess}
          prevAnswer={prevAnswer}
          prevAnswers={prevAnswers}
          answersLog={answersLog}
          setAnswersLog={setAnswersLog}
          />

          {gameActive &&
            <div className="play-game__button-div">
              <button
                title="Resign"
                className={`resign-button button ${preferences.theme}`}
                onClick={() => {setGameActive(false); endMatch()}}
             >Resign</button>
            </div>
          }

        {!gameActive && <GameOver
          gameLength={gameLength}
          answersLog={answersLog}
          answerStats={answerStats}
          score={score}
          highscore={highscore}
          resetGame={resetGame}
          panelActive={panelActive}
          setPanelActive={setPanelActive}
        />}
      </div>
    )
  } else {
    return <Navigate to='/start' />
  }
}