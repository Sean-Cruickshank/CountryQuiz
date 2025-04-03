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
  let category = 'test'

  function generateQuestion() {
    setRound(prev => prev + 1)

    let countryAnswers: {}[] = []
    if (countryData) {
      // Selects the question category
      const categoryNum = Math.floor(Math.random() * categories.length)
      // category = categories[categoryNum]
      category = 'low-area'
      console.log(category)

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
      let answer

      // Determines the answer with the highest population
      function highPop() {
        let population = 0
        let answer = ''
        countryAnswers.forEach((country) => {
          if (country.population > population) {
            population = country.population
            answer = country.name.common
          }
        })
        console.log('Highest Population: ', answer, population)
        return population
      }

      // Determines the answer with the lowest population
      function lowPop() {
        let population = 999999999999
        let answer = ''
        countryAnswers.forEach((country) => {
          if (country.population < population) {
            population = country.population
            answer = country.name.common
          }
        })
        console.log('Lowest Population: ', answer, population)
        return population
      }

      // Determines the answer with the largest area
      function highArea() {
        let area = 0
        let answer = ''
        countryAnswers.forEach((country) => {
          if (country.area > area) {
            area = country.area
            answer = country.name.common
          }
        })
        console.log('Largest Area: ', answer, area)
        return area
      }

      // Determines the answer with the smallest area
      function lowArea() {
        let area = 999999999999
        let answer = ''
        countryAnswers.forEach((country) => {
          if (country.area < area) {
            area = country.area
            answer = country.name.common
          }
        })
        console.log('Smallest Area: ', answer, area)
        return area
      }

      // Determines the answer based on the category
      if (category === 'high-population') {
        answer = highPop()
      } else if (category === 'low-population') {
        answer = lowPop()
      } else if (category === 'high-area') {
        answer = highArea()
      } else if (category === 'low-area') {
        answer = lowArea()
      } else {
        console.error('Invalid category selected')
      }

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
    if (category === 'high-population' && answer === country.population) {
      setScore(prev => prev + 1)
    } else if (category === 'low-population' && answer === country.population) {
      setScore(prev => prev + 1)
    } else if (category === 'high-area' && answer === country.area) {
      setScore(prev => prev + 1)
    } else if (category === 'low-area' && answer === country.area) {
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