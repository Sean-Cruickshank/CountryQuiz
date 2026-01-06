import breakCategory from "../util/breakCategory"
import convertToMiles from "../util/convertToMiles"
import useEffectOnUpdate from "../util/useEffectOnUpdate"

import { nanoid } from "nanoid"
import React, { JSX } from "react"

import generateTitle from "../util/generateTitle"

import { Country, AnswersLog } from "../util/interfaces"
import { useOutletContext } from "react-router-dom"

interface RecapProps {
  category: string[],
  prevGuess?: Country,
  prevAnswer?: Country,
  prevAnswers?: Country[],
  answersLog: AnswersLog[],
  setAnswersLog: React.Dispatch<React.SetStateAction<AnswersLog[]>>
}

export default function Recap({ category, prevGuess, prevAnswer, prevAnswers, answersLog, setAnswersLog }: RecapProps) {

  const context: {theme: string, indicator: string} = useOutletContext()
  const theme = context ? context.theme : 'blue'
  const indicator = context ? context.indicator : 'greenred'
  
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
        
        return prevAnswers?.map(country => {
          index++
          return <p
            key={nanoid()}
            className={`
              recap__answers__item
              ${prevGuessName === country.name
                ? `recap__answers__guess ${theme}`
                : ''}
            `}>
            <b>#{index}</b>
            {generateAnswerText(country)}
          </p>
        })
      }

      // For generating the correct text based on the question type
      function generateAnswerText(country: Country | undefined) {
        if (country && country.name === 'No Answer') { return <i> {country.name}</i> }

        if (country && type === 'area') {
          return <i> {country.name} - {country.area.toLocaleString()}km² ({convertToMiles(country.area)}mi²)</i>
        } else if (country && type === 'population') {
          return <i> {country.name} (Population: {country.population.toLocaleString()})</i>
        }
      }
  
      return (
        <div className={prevGuessName === prevAnswerName
          ? `${indicator} recap recap--correct`
          : `${indicator} recap recap--incorrect`}>
          <div className="recap__content">
            <div className="recap__result">
              {prevGuessName === prevAnswerName
                ? <p className="recap__result__text">CORRECT!</p>
                : <p className="recap__result__text">INCORRECT!</p>
              }
            </div>
            <div className="recap__title">
              {generateTitle(2, category)}
            </div>
            <div className="recap__answers">
              {allAnswers(type, size)}
            </div>
          </div>
        </div>
      )
    }
  }

  // Contains the HTML for the previous questions guess and answer
  const [recap, setRecap] = React.useState<JSX.Element>()

  function categoryOnUpdate() {
    setRecap(generateRecap())
  }

  // Custom useEffect for skipping the first render
  useEffectOnUpdate(categoryOnUpdate, [category])

  return (
    <>
      {answersLog.length > 0 && recap}
    </>
  )
}