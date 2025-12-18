import { useNavigate } from "react-router-dom"
import React from "react"
import Pagination from "./Pagination"
import useEffectOnUpdate from "../util/useEffectOnUpdate"
import { formatStats, generateMeter } from "../util/generateMeter"

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

  const lsHistory = localStorage.getItem('history')
  const [playerHistory, setPlayerHistory] = React.useState<PlayerHistory[]>(lsHistory !== null ? JSON.parse(lsHistory) : [])

  const currentTheme = localStorage.getItem('theme') || 'blue'

  let navigate = useNavigate()

  const playerHistoryFirstRender = React.useRef(true)
  React.useEffect(() => {
    if (playerHistoryFirstRender.current) {
      playerHistoryFirstRender.current = false
    } else {
      localStorage.setItem('history', JSON.stringify(playerHistory))
    }
  },[playerHistory])
  
  const lsHighscore = localStorage.getItem('highscore')
  const [highscore, setHighscore] = React.useState(lsHighscore !== null ? JSON.parse(lsHighscore) : 0)

  // Custom useEffect for skipping the first render
  useEffectOnUpdate(() => localStorage.setItem('highscore', JSON.stringify(highscore)), [highscore])

  let scoreSum = 0, gameLengthSum = 0
  let statsSum = {
    hpq: 0, hpa: 0, lpq: 0, lpa: 0,
    haq: 0, haa: 0, laq: 0, laa: 0
  }
  
  const historyHTML = playerHistory.reverse().map((match) => {
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

  function formatDate(date: string): string {
    const split = date.split(' ')
    let suffix = 'th'
    if (split[0] === '1' || split[0] === '21' || split[0] === '31') {suffix = 'st'}
    if (split[0] === '2' || split[0] === '22') {suffix = 'nd'}
    if (split[0] === '3' || split[0] === '23') {suffix = 'rd'}
    return `${split[0]}${suffix} ${split[1]} ${split[2]} (${split[3]})`
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

      <div className="stats__buttons">
        <button
          title="Reset History"
          onClick={() => setPlayerHistory([])}
          className={`stats__reset-history button ${currentTheme}`}
          >Reset History
        </button>
        <button
          title="Reset Highscore"
          onClick={() => setHighscore(0)}
          className={`stats__reset-highscore button ${currentTheme}`}
          >Reset Highscore
        </button>
      </div>

      {playerHistory.length > 0 &&
        <div className="stats__averages">
          {generateMeter('High Population', statsSum.hpq, statsSum.hpa)}
          {generateMeter('Low Population', statsSum.lpq, statsSum.lpa)}
          {generateMeter('High Area', statsSum.haq, statsSum.haa)}
          {generateMeter('Low Area', statsSum.laq, statsSum.laa)}
        </div>
      }

      <button
        title="Play Again"
        className={`stats__play-again button ${currentTheme}`}
        onClick={() => navigate('/play')}
        >Play Again
      </button>

      {playerHistory.length > 0
      ?
        <div className="stats__entries">
          <h2>Match History</h2>
          <div className="stats__entry-titles">
            <h3>Date:</h3>
            <h3>Score:</h3>
            <h3>High Population:</h3>
            <h3>Low Population:</h3>
            <h3>High Area:</h3>
            <h3>Low Area:</h3>
          </div>
          <Pagination lastPage={Math.ceil(historyHTML.length / 10)} pageContent={historyHTML} />
        </div>
      :
        <p>You have no matches on record!</p>
      }
    </div>
  )
}