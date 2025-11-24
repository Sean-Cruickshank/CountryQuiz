import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function StartGame() {
    // Grabs the current page theme so it can be applied to the answer buttons
    const currentTheme = localStorage.getItem('theme') || 'blue'

    const savedGameLength = Number(localStorage.getItem('gameLength')) || 30
    const savedTimerLength = Number(localStorage.getItem('timerLength')) || 10
    const savedTimerActive = localStorage.getItem('timerActive')
        ? (localStorage.getItem('timerActive') === 'true')
        : false

    let navigate = useNavigate()
    function viewPage(page: string) {
        navigate(`/${page}`, {state: { gameLength: gameLength, timerLength: timerLength, timerActive: timerActive }})
        window.scrollTo({
            top: 0
        });
    }

    const [gameLength, setGameLength] = useState<number>(savedGameLength)
    const [timerLength, setTimerLength] = useState<number>(savedTimerLength)
    const [timerActive, setTimerActive] = useState<boolean>(savedTimerActive)

    function handleRange(event: React.ChangeEvent<HTMLInputElement>) {
        const type = event.target.name
        const value = Number(event.target.value)
        if (type !== 'gameLength' && type !== 'timerLength') return
        type === 'gameLength' ? setGameLength(value) : setTimerLength(value)
        localStorage.setItem(type, JSON.stringify(value))
    }

    function handleCheckbox(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.checked
        setTimerActive(value)
        localStorage.setItem('timerActive', JSON.stringify(value))
        console.log(value)
    }

    return (
        <div className="start-game">
            <h2>New Game</h2>
            <label htmlFor="gameLength">Number of Questions: {gameLength}</label>
            <input
                type="range" id="gameLength" name="gameLength" className="start-game__range"
                min="5" max="100" step="5"
                value={gameLength} onChange={handleRange}>
            </input>

            <label htmlFor="timerLength">Timer Length (seconds): {timerLength}</label>
            <input
                type="range" id="timerLength" name="timerLength" className="start-game__range"
                min="5" max="60" step="5"
                value={timerLength} onChange={handleRange} disabled={!timerActive}>
            </input>

            <label htmlFor="timerActive">Enable Timer:</label>
            <input
                type="checkbox" id="timerActive" name="timerActive" className="start-game__checkbox"
                checked={timerActive} onChange={handleCheckbox}>
            </input>

            <button
                title="Start Game"
                className={`button start-game__button ${currentTheme}`}
                onClick={() => viewPage('play')}
                >Start Game
            </button>
        </div>
    )
}