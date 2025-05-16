import breakCategory from "./breakCategory"
import convertToMiles from "./convertToMiles"
import generateTitle from "./generateTitle"

import { nanoid } from "nanoid"
import { JSX } from "react"

interface Country {
  id: number,
  name: string,
  population: number,
  area: number
}

interface AnswersLog {
  type: string,
  size: string,
  prevGuessName: string,
  prevGuessValue: number,
  prevAnswerName: string,
  prevAnswerValue: number
}

interface RecapParameters {
  category: string[],
  currentTheme: string,
  prevGuess?: Country,
  prevAnswer?: Country,
  prevAnswers?: Country[],
  answersLog: AnswersLog[],
  setAnswersLog: React.Dispatch<React.SetStateAction<AnswersLog[]>>
}

// Generates the recap for the previous question, shows the correct answer and the guessed answer
export default function generateRecap(param: RecapParameters) {
  
  const { category, currentTheme, prevGuess, prevAnswer, prevAnswers, answersLog, setAnswersLog} = param
  
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

    function allAnswers(type: string, size: string) {
      let index = 0
      if (type === 'population' || type === 'area') {
        if (size === 'low') {
          prevAnswers?.sort((a,b) => a[type] - b[type])
        }
        if (size === 'high') {
          prevAnswers?.sort((a,b) => b[type] - a[type])
        }
      }
      
      if (type === 'area') {
        return prevAnswers?.map(country => {
          index++
          return <p
            key={nanoid()}
            className={`
              recap__answers__item
              ${prevGuessName === country.name
              ? `recap__answers__guess ${currentTheme}` : ''}
            `}>
              <b>#{index}</b>
              <i> {country.name} - {country.area.toLocaleString()}km² ({convertToMiles(country.area)}mi²)</i>
          </p>
        })
      } else {
        return prevAnswers?.map(country => {
          index++
          return <p
            key={nanoid()}
            className={`
              recap__answers__item
              ${prevGuessName === country.name
              ? `recap__answers__guess ${currentTheme}` : ''}
            `}>
            <b>#{index}</b>
            <i> {country.name} (Population: {country.population.toLocaleString()})</i>
          </p>
        })
      }
    }

    let guessText: JSX.Element

    if (type === 'area' && prevGuess && prevAnswer) {
      guessText = <p className="recap__guess">You picked: {prevGuessName} - {prevGuessValue.toLocaleString()}km² ({convertToMiles(prevGuess.area)}mi²)</p>
    } else {
      guessText = <p className="recap__guess">{prevGuessName} (Population: {prevGuessValue.toLocaleString()})</p>
    } 

    return (
      <div className={prevGuessName === prevAnswerName ? 'recap--correct' : 'recap--incorrect'}>
        <div className="recap__content__left">
          <div className="recap__result">
            {prevGuessName === prevAnswerName
              ? <p className="recap__result__text">CORRECT!</p>
              : <p className="recap__result__text">INCORRECT!</p>
            }
          </div>
          <div className="recap__title">
            {generateTitle(2, category)}
          </div>
          <p>You picked:</p>
          {guessText}
        </div>

        <div className="recap__content__right">
          <p>The answers were:</p>
          <div className="recap__answers">
            {allAnswers(type, size)}
          </div>
        </div>
      </div>
    )
  }
}