import { nanoid } from "nanoid"

import { Country } from "./interfaces"

export function generateAnswerNodes(answerNodes: string[]) {
  return answerNodes.map(node => {
    return (
      <span key={nanoid()} className={`node--${node}`}></span>
    )
  })
}

// Sets the answer node for the previous question (the little red or green ball)
export function updateAnswerNodes(
  round: number,
  setAnswerNodes: React.Dispatch<React.SetStateAction<string[]>>,
  prevGuess?: Country,
  prevAnswer?: Country
) {
  const prevGuessName: string = prevGuess
    ? prevGuess.name
    : ''
  const prevAnswerName = prevAnswer
  ? prevAnswer.name
  : ''
  if (round !== 1) {
    if (prevGuessName === prevAnswerName) {
      setAnswerNodes(prev => [...prev, 'green'])
    } else {
      setAnswerNodes(prev => [...prev, 'red'])
    }
  }
}