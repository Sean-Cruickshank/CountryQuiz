import { nanoid } from "nanoid"
import { Country } from "./interfaces"


export function generateAnswerNodes(answerNodes: string[], gameLength: number, indicator: string) {
  
  const nodeStyles = {
    width: `${100 / gameLength}%`
  }

  return answerNodes.map(node => {
    return (
      <div key={nanoid()} className="node__container" style={nodeStyles}>
        <span className={`node node--${node} ${indicator}`}></span>
      </div>
    )
  })
}

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