import React from 'react';

export default function App() {

  const [countryData, setCountryData] = React.useState([])
  const [displayData, setDisplayData] = React.useState([])

  const [score, setScore] = React.useState(0)
  const [highscore, setHighscore] = React.useState(0)
  const [round, setRound] = React.useState(0)

  React.useEffect(() => {

  },[])
  
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
  let category = ''

  function generateQuestion() {
    setRound(prev => prev + 1)

    let countryAnswers: {}[] = []
    if (countryData) {
      // Selects the question category
      const categoryNum = Math.floor(Math.random() * categories.length)
      category = categories[categoryNum]
      // category = 'low-area'

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
        console.log(category, answer)
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
            <i>Population: {country.population} </i>
            <i>Area: {country.area} </i>
          </div>
        )
      })
      setDisplayData(countryAnswersHTML)
    }
  }

  function answerCheck(category: string, answer: number, country: {}) {
    const type = category.split('-')[1]
    if (answer === country[type]) {
      setScore(prev => prev + 1)
    }
    generateQuestion()
  }

  function endMatch() {
    setHighscore(score)
    setScore(0)
    setRound(0)
  }
  
  return (
    <>
    <h2>Category: {category}</h2>
    <button onClick={generateQuestion}>Next Question</button>
    {displayData}
    <p>Score: {score}</p>
    <p>Highscore: {highscore}</p>
    <p>Round: {round}/30</p>
    </>
  )
}