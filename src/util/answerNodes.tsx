import { nanoid } from "nanoid"

import { Country } from "./interfaces"

export function generateAnswerNodes(answerNodes: string[]) {
  // Grabs the current indicator so it can be applied to the nodes
  const currentIndicator = localStorage.getItem('indicator') || 'greenred'
  return answerNodes.map(node => {
    return (
      <span
        key={nanoid()}
        className={`node node--${node} ${currentIndicator}`}
        onClick={() => console.log(currentIndicator)}
      ></span>
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
      setAnswerNodes(prev => [...prev, 'correct'])
    } else {
      setAnswerNodes(prev => [...prev, 'incorrect'])
    }
  }
}