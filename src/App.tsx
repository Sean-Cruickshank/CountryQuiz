import React from 'react';

export default function App() {

  const [countryData, setCountryData] = React.useState([])
  const [displayData, setDisplayData] = React.useState([])

  const [score, setScore] = React.useState(0)
  const [highscore, setHighscore] = React.useState(0)
  const [round, setRound] = React.useState(1)
  
  React.useEffect(() => {
    fetch('https://restcountries.com/v3.1/independent?status=true')
    .then(response => {
      console.log('API data retrieved...')
      if (!response.ok) {
        throw new Error("Could not fetch resource");
      }
      return response.json()
    })
    .then(data => {
      setCountryData(data)
    })
    .catch(error => console.error(error))
  },[])

  const categories = [
    'high-population',
    'low-population',
    'high-area',
    'low-area'
  ]

  const [category, setCategory] = React.useState('')

  // Selects the question category
  function generateCategory() {
    // Selects the category at random
    const categoryNum = Math.floor(Math.random() * categories.length)
    // Appends a unique ID so that if the same category is picked twice in a row it will still trigger the useEffect
    const categoryID = `${categories[categoryNum]}-${Date.now()}`
    setCategory(categoryID)
  }

  // Generates a new question when the category is selected
  React.useEffect(() => {
    generateQuestion()
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
        let answer
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

      const answer = generateAnswer(category)

      // Generates the HTML for the four answers
      const countryAnswersHTML = countryAnswers.map((country) => {
        return (
          <div key={country.name.common}>
            <button
              onClick={() => answerCheck(category, answer, country)}
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
    generateCategory()
  }

  React.useEffect(() => {
    // console.log('Current Round: ', round)
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
  
  return (
    <>
    <h2>Category: {category}</h2>
    <button onClick={generateCategory}>Next Question</button>
    {displayData}
    <p>Score: {score}</p>
    <p>Highscore: {highscore}</p>
    <p>Round: {round}/30</p>
    </>
  )
}