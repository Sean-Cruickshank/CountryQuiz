import { useNavigate, useOutletContext } from "react-router-dom"
import { useEffect, useState } from "react"

export default function StartGame() {
    const context: {theme: string, indicator: string} = useOutletContext()
    const theme = context ? context.theme : 'blue'

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

        if (type === 'gameLength') {
            setGameLength(value)
        }

        if (type === 'timerLength') {
            setTimerLength(value)
        }

        localStorage.setItem(type, JSON.stringify(value))
    }

    function handleCheckbox(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.checked
        setTimerActive(value)
        localStorage.setItem('timerActive', JSON.stringify(value))
    }

    /*
        Allows ranges to be rendered correctly on Chromium browsers

        There is no option to apply styles to the "active" portion of the range bar, so a background
        gradient is applied instead based on the values associated with the range bar (value, min, max)

        The useEffect and function:
            A) Apply these values on page load
            B) Keep the values updated when the range is interacted with
    */
    useEffect(() => {
        function updateRange(range: HTMLElement) {
            if (range instanceof HTMLInputElement) {
                const value = Number(range.value)
                const min = Number(range.min)
                const max = Number(range.max)
                const val = (value - min) / (max - min) * 100 + "%"
                range.style.setProperty("--range-progress", val)
            }
        }
        document.querySelectorAll('.start-game__range').forEach(range => {
            if (range instanceof HTMLInputElement) {
                updateRange(range)
                range.addEventListener('input', () => updateRange(range))
            }
        })
    },[])
    

    return (
        <div className="start-game">
            <h1>New Game</h1>
            <div className={`panel start-game__panel ${theme}`}>
                <div className="start-game__panel--top">
                    <div>
                        <label htmlFor="timerActive">Enable Timer:</label>
                        <label className='switch'>
                            <input type="checkbox"
                                id="timerActive" name="timerActive" className={`switch__input ${theme}`}
                                checked={timerActive} onChange={handleCheckbox}>
                            </input>
                            <span className='slider'></span>
                        </label>
                    </div>
                </div>

                <hr />
                
                <div className="start-game__panel--section">
                    <label htmlFor="gameLength">NUMBER OF QUESTIONS</label>
                    <input type="range"
                        id="gameLength" name="gameLength" className={`start-game__range ${theme}`}
                        min="5" max="100" step="5"
                        value={gameLength} onChange={handleRange}>
                    </input>
                    <p className="start-game__output">{gameLength}</p>
                </div>

                <div className="start-game__panel--section">
                    <label htmlFor="timerLength">ROUND LENGTH</label>
                    <input type="range"
                        id="timerLength" name="timerLength" className={`start-game__range ${theme}`}
                        min="5" max="60" step="5"
                        value={timerLength} onChange={handleRange} disabled={!timerActive}>
                    </input>
                    {timerActive
                        ? <p className="start-game__output">{timerLength} seconds</p>
                        : <p className="start-game__output">Unlimited</p>}
                </div>
            </div>

            <button
                title="Start Game"
                className={`button start-game__button ${theme}`}
                onClick={() => viewPage('play')}
                >Start Game
            </button>
        </div>
    )
}