import { Link } from "react-router-dom"
import React from "react"

export default function Profile() {

  // Handles Player History array
  // Pulls playerHistory from localStorage and saves to state
  // Reset playerHistory sets state to 0 and then updates localStorage
  const [playerHistory, setPlayerHistory] = React.useState(JSON.parse(localStorage.getItem('history')) || [])

  function resetHistory() {
    setPlayerHistory([])
  }
  const playerHistoryFirstRender = React.useRef(true)
  React.useEffect(() => {
    if (playerHistoryFirstRender.current) {
      playerHistoryFirstRender.current = false
    } else {
      localStorage.setItem('history', JSON.stringify(playerHistory))
    }
  },[playerHistory])
  
  // Handles Highscore
  // Pulls highscore from localStorage and saves to state
  // Reset Highscore sets state to 0 and then updates localStorage
  const [highscore, setHighscore] = React.useState(JSON.parse(localStorage.getItem('highscore')))

  function resetHighscore() {
    setHighscore(0)
  }
  const highscoreFirstRender = React.useRef(true)
  React.useEffect(() => {
    if (highscoreFirstRender.current) {
      highscoreFirstRender.current = false
    } else {
      localStorage.setItem('highscore', JSON.stringify(highscore))
    }
  },[highscore])

  let scoreSum = 0, gameLengthSum = 0
  let statsSum = {
    hpq: 0, hpa: 0, lpq: 0, lpa: 0,
    haq: 0, haa: 0, laq: 0, laa: 0
  }
  
  // Generates HTML for player history
  const historyList = playerHistory.map((match) => {
    // Adds stats for each game to cumulative values
    scoreSum += match.score
    gameLengthSum += match.gameLength
    statsSum.hpq += match.answerStats.highpopulation.Q
    statsSum.hpa += match.answerStats.highpopulation.A
    statsSum.lpq += match.answerStats.lowpopulation.Q
    statsSum.lpa += match.answerStats.lowpopulation.A
    statsSum.haq += match.answerStats.higharea.Q
    statsSum.haa += match.answerStats.higharea.A
    statsSum.laq += match.answerStats.lowarea.Q
    statsSum.laa += match.answerStats.lowarea.A
    return (
      <div key={match.id} className="profile__entry">
        <p>{formatDate(match.date)}</p>
        <p>{formatStats(match.score, match.gameLength)} ({match.score}/{match.gameLength})</p>
        <p>{formatStats(match.answerStats.highpopulation.A, match.answerStats.highpopulation.Q)}</p>
        <p>{formatStats(match.answerStats.lowpopulation.A, match.answerStats.lowpopulation.Q)}</p>
        <p>{formatStats(match.answerStats.higharea.A, match.answerStats.higharea.Q)}</p>
        <p>{formatStats(match.answerStats.lowarea.A, match.answerStats.lowarea.Q)}</p>
      </div>
    )
  })

  function formatStats(a: number, q: number): string {
    if (q > 0) {
      return `${((a / q) * 100).toFixed(0)}%`
    } else return 'N/A'
  }

  function formatDate(date: string): string {
    const split = date.split(' ')
    return `${split[0]}th ${split[1]} ${split[2]} (${split[3]})`
  }
  
  return (
    <div className="profile">
      <div className="profile__entries">
        <div className="profile__entry-titles">
          <p>Date:</p>
          <p>Score:</p>
          <p>High Population:</p>
          <p>Low Population:</p>
          <p>High Area:</p>
          <p>Low Area:</p>
        </div>
        {historyList}
        {playerHistory.length > 0 ? <div className="profile__averages">
          <p>Average Score: {formatStats(scoreSum, gameLengthSum)} </p>
          <p>{formatStats(statsSum.hpa, statsSum.hpq)} ({statsSum.hpa}/{statsSum.hpq})</p>
          <p>{formatStats(statsSum.lpa, statsSum.lpq)} ({statsSum.lpa}/{statsSum.lpq})</p>
          <p>{formatStats(statsSum.haa, statsSum.haq)} ({statsSum.haa}/{statsSum.haq})</p>
          <p>{formatStats(statsSum.laa, statsSum.laq)} ({statsSum.laa}/{statsSum.laq})</p>
        </div>: ""}
      </div>
      <p>Highscore: {highscore}</p>
      <Link to='/'>New Game</Link>
      <button onClick={resetHistory} className="profile__reset-history">Reset History</button>
      <button onClick={resetHighscore} className="profile__reset-highscore">Reset Highscore</button>
    </div>
  )
}