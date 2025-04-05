import React from "react"
import { Navigate } from "react-router-dom"

export default function PlayGame({ countryData }) {
  const [displayData, setDisplayData] = React.useState([])

  const [score, setScore] = React.useState(0)
  const [highscore, setHighscore] = React.useState(0)
  const [round, setRound] = React.useState(1)

  const categories = [
    'high-population',
    'low-population',
    'high-area',
    'low-area'
  ]
  const [category, setCategory] = React.useState([])

  const [prevGuess, setPrevGuess] = React.useState(null)
  const [prevAnswer, setPrevAnswer] = React.useState([])

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
        const answerCountry = countryAnswers.find((country) => {
          return country[type] === answer
        })
        setPrevAnswer([...prevAnswer, answerCountry])
        return answer
      }

      const answer = generateAnswer(category[category.length - 1])
    
      // Generates the HTML for the four answers
      const countryAnswersHTML = countryAnswers.map((country) => {
        return (
          <div key={country.name.common}>
            <button
              onClick={() => answerCheck(category[category.length - 1], answer, country)}
            >{country.name.common}</button>
            <i>Population: {country.population.toLocaleString()} </i>
            <i>Area: {country.area.toLocaleString()} </i>
          </div>
        )
      })
      setDisplayData(countryAnswersHTML)
    }
  }

  // The onClick function for the four answer buttons
  // Determines whether to award a point based on the users selected answer, increments round counter, generates next question if round counter is below 30 
  function answerCheck(category: string, answer: number, country: {}) {
    const type = category.split('-')[1]
    if (answer && answer === country[type]) {
      setScore(prev => prev + 1)
    }
    setRound(prev => prev + 1)
    setPrevGuess(country)
    generateCategory()
  }

  React.useEffect(() => {
    if (round > 30) {
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
  
  if (countryData.length > 0 && category) {
    return (
      <>
      {category.length > 0 && category.toReversed()[0].includes('high-population') && <h2>Guess the country with the <i>highest population</i>!</h2>}
      {category.length > 0 && category.toReversed()[0].includes('low-population') && <h2>Guess the country with the <i>lowest population</i>!</h2>}
      {category.length > 0 && category.toReversed()[0].includes('high-area') && <h2>Guess the country with the <i>largest land area</i>!</h2>}
      {category.length > 0 && category.toReversed()[0].includes('low-area') && <h2>Guess the country with the <i>smallest land area</i>!</h2>}
      {displayData}
      <p>Score: {score}</p>
      <p>Highscore: {highscore}</p>
      <p>Round: {round}/30</p>
      {/* Displays previous guess and previous correct answer if they both exist and the category is 'area' */}
      {/* .toReversed()[1] grabs the secound to last entry in the array */}
      {prevAnswer[prevAnswer.length - 2] && category.toReversed()[1].split('-')[1] === 'area' && 
          <div>
            <p>You picked: {prevGuess.name.common} (Area: {prevGuess.area.toLocaleString()}m^2)</p>
            <p>Correct answer: {prevAnswer.toReversed()[1].name.common} (Area: {prevAnswer.toReversed()[1].area.toLocaleString()}m^2)</p>
          </div>
      }
      {/* Displays previous guess and previous correct answer if they both exist and the category is 'population' */}
      {/* .toReversed()[1] grabs the secound to last entry in the array */}
      {prevAnswer.toReversed()[1] && category.toReversed()[1].split('-')[1] === 'population' &&
        <div>
          <p>You picked: {prevGuess.name.common} (Population: {prevGuess.population.toLocaleString()})</p>
          <p>Correct answer: {prevAnswer.toReversed()[1].name.common} (Population: {prevAnswer.toReversed()[1].population.toLocaleString()})</p>
        </div>
      }
      </>
    )
    // Returns user to the Home page if the page loads before the API has finished loading (happens if you refresh on /play)
  } else {
    return <Navigate to='/' />
  }

}