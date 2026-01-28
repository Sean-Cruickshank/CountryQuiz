import breakCategory from "../util/breakCategory"
import generateUnit from "../util/generateUnit"
import React from "react"

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

  const context: {theme: string, indicator: string, unit: string} = useOutletContext()

  const preferences = {
    theme : context ? context.theme : 'blue',
    indicator : context ? context.indicator : 'greenred',
    unit : context ? context.unit : 'metric'
  }

  const recapData = React.useMemo(generateRecapData, [category, prevGuess, prevAnswer, prevAnswers])

  React.useEffect(() => {
    if (!recapData) return

    setAnswersLog(prev => {
      const alreadyLogged = prev.some(
        log =>
          log.prevGuessName === recapData.prevGuessName &&
          log.prevAnswerName === recapData.prevAnswerName &&
          log.type === recapData.type &&
          log.size === recapData.size
      )

      if (alreadyLogged) return prev

      return [
        ...prev,
        {
          type: recapData.type,
          size: recapData.size,
          prevGuessName: recapData.prevGuessName,
          prevGuessValue: recapData.prevGuessValue,
          prevAnswerName: recapData.prevAnswerName,
          prevAnswerValue: recapData.prevAnswerValue
        }
      ]
    })
  }, [recapData])

  function generateRecapData() {
    if (category.length <= 1 || !prevGuess || !prevAnswer || !prevAnswers) return null

    const [type, size] = breakCategory(category[category.length - 2])

    const prevGuessName = prevGuess.name
    const prevGuessValue = prevGuess[type]
    const prevAnswerName = prevAnswer.name
    const prevAnswerValue = prevAnswer[type]

    return {type, size, prevGuessName, prevGuessValue, prevAnswerName, prevAnswerValue, prevAnswers}
  }

  if (!recapData || answersLog.length === 0) {
    return null
  }

  return (
    <div
      className={
          `${preferences.indicator} ${preferences.theme} recap
          ${recapData.prevGuessName === recapData.prevAnswerName ? ` recap--correct` : `recap--incorrect`}`
      }
    >
      <div className="recap__content">
        <div className="recap__result">
          {recapData.prevGuessName === recapData.prevAnswerName ? (
            <p className="recap__result__text">CORRECT!</p>
          ) : (
            <p className="recap__result__text">INCORRECT!</p>
          )}
        </div>

        <div className="recap__title">
          {recapData && <p>{generateTitle(2, category)}</p>}
        </div>

        <div className="recap__answers">
          {recapData.prevAnswers
            .slice()
            .sort((a, b) => {
              if (recapData.type === "area" || recapData.type === "population") {
                return recapData.size === "low"
                  ? a[recapData.type] - b[recapData.type]
                  : b[recapData.type] - a[recapData.type]
              }
              return 0
            })
            .map((country, index) => (
              <p
                key={country.id}
                className={`recap__answers__item ${recapData.prevGuessName === country.name ? "recap__answers__guess" : ""}`}>
                <b>#{index + 1}</b>{" "}
                {recapData.type === "area"
                  ? <i>{country.name} - {generateUnit(country.area, preferences.unit)}</i>
                  : <i>{country.name} (Population: {country.population.toLocaleString()})</i>}
              </p>
            ))}
        </div>
      </div>
    </div>
  )

}