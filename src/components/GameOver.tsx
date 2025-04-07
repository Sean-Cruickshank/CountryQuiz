import { nanoid } from "nanoid"

export default function GameOver({ answersLog, answerStats, score }) {
  
  function titleCase(string: string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase()
  }
  
  // Generates the HTML for the Answers Log
  const generateLog = answersLog.map((question) => {
    const size = question.categoryPrev.split('-')[0]
    const type = question.categoryPrev.split('-')[1]
    let classname = ''
    question.prevGuessName === question.prevAnswerName
      ? classname = "answers-log__entry--green"
      : classname = "answers-log__entry--red"
    if (answersLog.length > 1) {
      if (type === 'population') {
        return (
          <div className={classname} key={nanoid()}>
            <p>{titleCase(size)} {titleCase(type)}:</p>
            <p>{question.prevGuessName} ({question.prevGuessValue})</p>
            <p>{question.prevAnswerName} ({question.prevAnswerValue})</p>
          </div>
        )
      } else {
        return (
          <div className={classname} key={nanoid()}>
            <p>{titleCase(size)} {titleCase(type)}:</p>
            <p>{question.prevGuessName} ({question.prevGuessValue}km²)</p>
            <p>{question.prevAnswerName} ({question.prevAnswerValue}km²)</p>
          </div>
        )
      }
    }
  })

  // Generates the HTML for the stats overview
  function generateStats() {
    let highPopulation, lowPopulation, highArea, lowArea
    // Sets the percentage of questions scored correctly per category
    // Defaults to 0 if no questions have been asked to avoid dividing by 0
    answerStats.highpopulation.Q > 0
      ? highPopulation = answerStats.highpopulation.A / answerStats.highpopulation.Q
      : highPopulation = 0

      answerStats.lowpopulation.Q > 0
      ? lowPopulation = answerStats.lowpopulation.A / answerStats.lowpopulation.Q
      : lowPopulation = 0

      answerStats.higharea.Q > 0
      ? highArea = answerStats.higharea.A / answerStats.higharea.Q
      : highArea = 0

      answerStats.lowarea.Q > 0
      ? lowArea = answerStats.lowarea.A / answerStats.lowarea.Q
      : lowArea = 0

    return (
      <div>
        <p>High Population: {(highPopulation * 100).toFixed(0)}% ({answerStats.highpopulation.A}/{answerStats.highpopulation.Q})</p>
        <p>Low Population: {(lowPopulation * 100).toFixed(0)}% ({answerStats.lowpopulation.A}/{answerStats.lowpopulation.Q})</p>
        <p>High Area: {(highArea * 100).toFixed(0)}% ({answerStats.higharea.A}/{answerStats.higharea.Q})</p>
        <p>Low Area: {(lowArea * 100).toFixed(0)}% ({answerStats.lowarea.A}/{answerStats.lowarea.Q})</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Game Over!</h2>
      <p>You got {score} out of 30 questions correct!</p>
      {generateStats()}
      <button>Play Again</button>
      <button>View History</button>
      <div className="answers-log">
        <div className="gameover_subheaders">
          <h3>Category:</h3>
          <h3>You Guessed:</h3>
          <h3>Correct Answer:</h3>
        </div>
        {generateLog}
      </div>
    </div>
  )
}