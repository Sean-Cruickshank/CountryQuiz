import { Link } from "react-router-dom"
import React from "react"

export default function Stats() {

  interface PlayerHistory {
    id: string,
    score: number,
    gameLength: number,
    date: string,
    answerStats: {
      highpopulation: {Q: number, A: number},
      lowpopulation:  {Q: number, A: number},
      higharea:  {Q: number, A: number},
      lowarea:  {Q: number, A: number},
    }
  }

  // Handles Player History array
  // Pulls playerHistory from localStorage and saves to state
  // Reset playerHistory sets state to 0 and then updates localStorage
  const lsHistory = localStorage.getItem('history')
  const [playerHistory, setPlayerHistory] = React.useState<PlayerHistory[]>(lsHistory !== null ? JSON.parse(lsHistory) : [])

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
  const lsHighscore = localStorage.getItem('highscore')
  const [highscore, setHighscore] = React.useState(lsHighscore !== null ? JSON.parse(lsHighscore) : 0)

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
      <div key={match.id} className="stats__entry">
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

  let averageScore

  if (playerHistory.length > 0) {
    averageScore = (scoreSum / playerHistory.length).toFixed(1)
  } else {
    averageScore = 0
  }
  
  return (
    <div className="stats">
      <h2>Statistics</h2>
      <p>Average Score: {averageScore}</p>
      <p>Highscore: {highscore}</p>
      <p>Matches Played: {playerHistory.length}</p>
      {playerHistory.length > 0 ?
        <div className="stats__averages">
          <div className="stats__category">
            <p>High Population: {formatStats(statsSum.hpa, statsSum.hpq)} ({statsSum.hpa}/{statsSum.hpq})</p>
            <meter value={statsSum.hpa} max={statsSum.hpq}></meter>
          </div>

          <div className="stats__category">
            <p>Low Population: {formatStats(statsSum.lpa, statsSum.lpq)} ({statsSum.lpa}/{statsSum.lpq})</p>
            <meter value={statsSum.lpa} max={statsSum.lpq}></meter>
          </div>

          <div className="stats__category">
            <p>High Area: {formatStats(statsSum.haa, statsSum.haq)} ({statsSum.haa}/{statsSum.haq})</p>
            <meter value={statsSum.haa} max={statsSum.haq}></meter>
          </div>

          <div className="stats__category">
            <p>Low Area: {formatStats(statsSum.laa, statsSum.laq)} ({statsSum.laa}/{statsSum.laq})</p>
            <meter value={statsSum.laa} max={statsSum.laq}></meter>
          </div>

        </div>: ""}
      <Link to='/play'>Play Again</Link>
      <button onClick={resetHistory} className="stats__reset-history">Reset History</button>
      <button onClick={resetHighscore} className="stats__reset-highscore">Reset Highscore</button>
      {playerHistory.length > 0
      ?
        <div className="stats__entries">
          <h2>Match History</h2>
          <div className="stats__entry-titles">
            <p>Date:</p>
            <p>Score:</p>
            <p>High Population:</p>
            <p>Low Population:</p>
            <p>High Area:</p>
            <p>Low Area:</p>
          </div>
          {historyList}
        </div>
      :
        <p>You have no matches on record!</p>
      }
      
    </div>
  )
}