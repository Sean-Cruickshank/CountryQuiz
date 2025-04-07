import { nanoid } from "nanoid"
import React from "react"
import { Navigate } from "react-router-dom"

import GameOver from "./GameOver"

export default function PlayGame({ countryData }) {
  // Contains the HTML for the four answer buttons
  const [displayData, setDisplayData] = React.useState([])

  const [score, setScore] = React.useState(0)
  const [highscore, setHighscore] = React.useState(0)
  const [round, setRound] = React.useState(1)

  // Contains an array of all category IDs for that match
  const [category, setCategory] = React.useState<string[]>([])

  // Contains the country object for the previous questions guess
  const [prevGuess, setPrevGuess] = React.useState<{}>({})

  // Contains the country object for the previous questions answer
  const [prevAnswer, setPrevAnswer] = React.useState<{}>({})

  // Contains an object array with the names and values of all previous guesses and answers
  const [answersLog, setAnswersLog] = React.useState<{}[]>([])

  const [answerStats, setAnswerStats] = React.useState({
    highpopulation: {
      Q: 0, A: 0
    },
    lowpopulation: {
      Q: 0, A: 0
    },
    higharea: {
      Q: 0, A: 0
    },
    lowarea: {
      Q: 0, A: 0
    }
  })

  // Contains the HTML for the previous questions guess and answer
  const [recap, setRecap] = React.useState()

  const categories = [
    'high-population',
    'low-population',
    'high-area',
    'low-area'
  ]

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
    let countryAnswers: {}[] = []
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

      // Determines the answer based on the category
      function generateAnswer(category: string) {
        const size = category.split('-')[0]
        const type = category.split('-')[1]
        let valArray: number[] = []
        let answer: number = 0
        countryAnswers.forEach((country) => {
          valArray.push(country[type])
        })
        if (type === 'area') {
          size === 'high'
            ? answer = Math.max(...valArray)
            : answer = Math.min(...valArray)
        } else if (type === 'population') {
          size === 'high'
            ? answer = Math.max(...valArray)
            : answer = Math.min(...valArray)
        }
        return answer
      }

      const answer = generateAnswer(category[category.length - 1])
    
      // Generates the HTML for the four answers
      const countryAnswersHTML = countryAnswers.map((country) => {
        return (
          <div className="answers-grid__option" key={nanoid()}>
            <button
              className="answers-grid__button"
              onClick={() => answerCheck(category[category.length - 1], answer, country)}
            >{country.name.common}</button>
            {/* <i>Population: {country.population.toLocaleString()} </i>
            <i>Area: {country.area.toLocaleString()} </i> */}
          </div>
        )
      })
      setDisplayData(countryAnswersHTML)
    }

    // The onClick function for the four answer buttons
    // Determines whether to award a point based on the users selected answer, increments round counter
    function answerCheck(category: string, answer: number, country: {}) {
      const type = category.split('-')[1]
      const size = category.split('-')[0]
      const sizetype = `${size}${type}`

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
      setRound(prev => prev + 1)
      // Grabs the corresponding country for the correct answer and saves it to state, also saves the guessed country to state
      const answerCountry = countryAnswers.find((country) => {
        return country[type] === answer
      })
      setPrevAnswer(answerCountry)
      setPrevGuess(country)
      // Generates the category for the next round (useEffect triggers the next question to also generate)
      generateCategory()
    }
  }

  React.useEffect(() => {
    if (round > 10) {
      endMatch()
      console.log('Game over!')
    } else {

    }
  },[round])

  function endMatch() {
    if (score > highscore) {
      setHighscore(score)
    }
    alert("Game Over")
    setScore(0)
    setRound(1)
  }

  // Generates the recap for the previous question, shows the correct answer and the guessed answer
  function generateRecap() {
    if (category.length > 1) {
      // Grabs some values from the previous quesiton
      const categoryPrev = category.toReversed()[1]
      const prevGuessName = prevGuess.name.common
      let prevGuessValue
      const prevAnswerName = prevAnswer.name.common
      let prevAnswerValue
      // If the previous category type was 'area' grab the area values from the previous guess/answer, save all values in the answers log, generate and return the HTML for the previous question recap
      if (categoryPrev.split('-')[1] === 'area') {
        prevGuessValue = prevGuess.area.toLocaleString()
        prevAnswerValue = prevAnswer.area.toLocaleString()
        setAnswersLog([...answersLog, {
          categoryPrev,
          prevGuessName,
          prevGuessValue,
          prevAnswerName,
          prevAnswerValue
        }])
        return (
          <div className="answers-recap">
            <p>You picked: {prevGuessName} (Area: {prevGuessValue}km²)</p>
            <p>Correct answer: {prevAnswerName} (Area: {prevAnswerValue}km²)</p>
          </div>
        )
      }
      // Same as above but for 'population'
      if (categoryPrev.split('-')[1] === 'population') {
        prevGuessValue = prevGuess.population.toLocaleString()
        prevAnswerValue = prevAnswer.population.toLocaleString()
        setAnswersLog([...answersLog, {
          categoryPrev,
          prevGuessName,
          prevGuessValue,
          prevAnswerName,
          prevAnswerValue
        }])
        return (
          <div className="answers-recap">
            <p>You picked: {prevGuessName} (Population: {prevGuessValue})</p>
            <p>Correct answer: {prevAnswerName} (Population: {prevAnswerValue})</p>
          </div>
        )
      }
    }
  }

  // Generates the question title based on the category selected
  function generateTitle() {
    if (category.length > 0) {
      if (category && category[category.length - 1].includes('high-population')) {
        return <h2>Guess the country with the <i>highest population</i>!</h2>
      }
      if (category && category[category.length - 1].includes('low-population')) {
        return <h2>Guess the country with the <i>lowest population</i>!</h2>
      }
      if (category && category[category.length - 1].includes('high-area')) {
        return <h2>Guess the country with the <i>largest land area</i>!</h2>
      }
      if (category && category[category.length - 1].includes('low-area')) {
        return <h2>Guess the country with the <i>smallest land area</i>!</h2>
      }
    }
  }
  
  if (countryData.length > 0) {
    return (
      <div className="play-game">
        {generateTitle()}
        <p>Question {round}/30</p>
        <div className="answers-grid">
          {displayData}
        </div>
        <div className="answers-score">
          <p>Score: {score}</p>
          <p>Highscore: {highscore}</p>
        </div>
        {recap}
        <GameOver answersLog={answersLog} answerStats={answerStats} score={score} />
      </div>
    )
    // Returns user to the Home page if the page loads before the API has finished loading (happens if you refresh on /play)
  } else {
    return <Navigate to='/' />
  }

}