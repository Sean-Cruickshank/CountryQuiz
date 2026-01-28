import { useNavigate, useOutletContext } from "react-router-dom"
import React from "react"
import Log from "./Log"
import useEffectOnUpdate from "../util/useEffectOnUpdate"
import { formatStats, generateMeter } from "../util/generateMeter"
import generateWaveEffect from "../util/generateWaveEffect"

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

  const context: {theme: string, indicator: string, unit: string} = useOutletContext()
  
  const preferences = {
    theme : context ? context.theme : 'blue',
    indicator : context ? context.indicator : 'greenred',
    unit : context ? context.unit : 'metric'
  }

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

  let perfectCount = 0
  const browserWidthSmall = window.innerWidth < 500
  const pageTitles = browserWidthSmall
    ? ['Date', 'Score', 'High Pop', 'Low Pop', 'High Area', 'Low Area']
    : ['Date', 'Score', 'High Population', 'Low Population', 'High Area', 'Low Area']
  
  const historyHTML = playerHistory.slice().reverse().map((match) => {
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
    let statsScore = `${formatStats(match.score, match.gameLength)} (${match.score}/${match.gameLength})`
    let effect = 'none'
    if (match.score === match.gameLength) {
      effect = 'perfect'
      perfectCount++
    }
    let formattedStatsScore = generateWaveEffect(statsScore, effect)

    return (
      <tr key={match.id} className="stats__entry">
        <td title={formatDate(match.date, 'long')}>{browserWidthSmall ? formatDate(match.date, 'short') : formatDate(match.date, 'long')}</td>
        {match.score === match.gameLength ? <td>{formattedStatsScore}</td> : <td>{statsScore}</td>}
        <td>{formatStats(match.answerStats.highpopulation.A, match.answerStats.highpopulation.Q)}</td>
        <td>{formatStats(match.answerStats.lowpopulation.A, match.answerStats.lowpopulation.Q)}</td>
        <td>{formatStats(match.answerStats.higharea.A, match.answerStats.higharea.Q)}</td>
        <td>{formatStats(match.answerStats.lowarea.A, match.answerStats.lowarea.Q)}</td>
      </tr>
    )
  })

  function formatDate(date: string, type: 'short' | 'long'): string {
    const split = date.split(' ')
    let suffix = 'th'
    if (split[0] === '1' || split[0] === '21' || split[0] === '31') suffix = 'st'
    if (split[0] === '2' || split[0] === '22') suffix = 'nd'
    if (split[0] === '3' || split[0] === '23') suffix = 'rd'
    if (type === 'long') return `${split[0]}${suffix} ${split[1]} ${split[2]} (${split[3]})`
    else return `${split[0]}${suffix} ${split[1]} ${split[2]}`
  }

  let averageScore
  if (playerHistory.length > 0) {
    averageScore = (scoreSum / playerHistory.length).toFixed(0)
  } else {
    averageScore = 0
  }

  function resetHighscore() {
    const confirmation = window.confirm('Are you sure you want to reset your highscore? \nThis cannot be undone.')
    confirmation && setHighscore(0)
  }

  function resetHistory() {
    const confirmation = window.confirm('Are you sure you want to reset your match history? \nThis cannot be undone.')
    confirmation && setPlayerHistory([])
  }
  
  return (
    <div className="stats">
      <h1>Statistics</h1>
      <div className={`panel stats__panel ${preferences.theme}`}>
        <div className="stats__text">
          <p>MATCHES PLAYED: <b>{playerHistory.length}</b></p>
        </div>
        <div className="stats__text">
          <p className="stats__text--p1">AVERAGE SCORE: <b>{averageScore}</b></p>
          <p className="stats__text--p2">HIGHSCORE: <b>{highscore}</b></p>
        </div>
        <div className="stats__text">
          {perfectCount > 0 && generateWaveEffect(`PERFECT MATCHES: ${perfectCount}`, 'perfect')}
        </div>

        {playerHistory.length > 0 &&
          <div className="stats__averages">
            {generateMeter('High Population', statsSum.hpq, statsSum.hpa)}
            {generateMeter('Low Population', statsSum.lpq, statsSum.lpa)}
            {generateMeter('High Area', statsSum.haq, statsSum.haa)}
            {generateMeter('Low Area', statsSum.laq, statsSum.laa)}
          </div>
        }

        <div className="stats__buttons">
          <button
            title="Reset History"
            onClick={() => resetHistory()}
            className={`stats__reset-history button ${preferences.theme}`}
            >Reset History
          </button>
          <button
            title="Reset Highscore"
            onClick={() => resetHighscore()}
            className={`stats__reset-highscore button ${preferences.theme}`}
            >Reset Highscore
          </button>
        </div>
      </div>

      <button
        title="New Game"
        className={`stats__new-game button ${preferences.theme}`}
        onClick={() => navigate('/play')}
        >New Game
      </button>

      {playerHistory.length > 0
      ?
        <div className="stats__entries">
          <h2>Match History</h2>
          <Log
            pageTitles={pageTitles}
            lastPage={Math.ceil(historyHTML.length / 10)}
            pageContent={historyHTML}
          />
        </div>
      :
        <p>You have no matches on record!</p>
      }
    </div>
  )
}