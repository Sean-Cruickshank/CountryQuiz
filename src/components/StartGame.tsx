import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function StartGame() {
    // Grabs the current page theme so it can be applied to the answer buttons
    const currentTheme = localStorage.getItem('theme') || 'blue'

    let navigate = useNavigate()
    function viewPage(page: string) {
        navigate(`/${page}`, {state: { gameLength: gameLength, timerLength: timerLength }})
        window.scrollTo({
            top: 0
        });
    }

    const [gameLength, setGameLength] = useState(5)
    const [timerLength, setTimerLength] = useState(12)

    function modify(state: string, modifier: string, value: number) {
        if (state === 'gameLength' && modifier === '-') {
            gameLength - value >= 1 ? setGameLength(prev => prev - value) : setGameLength(1)
        }

        if (state === 'gameLength' && modifier === '+') {
            gameLength + value <= 20 ? setGameLength(prev => prev + value) : setGameLength(20)
        }

        if (state === 'timerLength' && modifier === '-') {
            timerLength - value >= 1 ? setTimerLength(prev => prev - value) : setTimerLength(1)
        }

        if (state === 'timerLength' && modifier === '+') {
            timerLength + value <= 20 ? setTimerLength(prev => prev + value) : setTimerLength(20)
        }

    }

    return (
        <div>
            <p>Number of Questions</p>
            <button onClick={() => modify('gameLength', '-', 5)}>-5</button>
            <button onClick={() => modify('gameLength', '-', 1)}>-1</button>
            <p>{gameLength}</p>
            <button onClick={() => modify('gameLength', '+', 1)}>+1</button>
            <button onClick={() => modify('gameLength', '+', 5)}>+5</button>
            <p>Timer Length</p>
            <button onClick={() => modify('timerLength', '-', 5)}>-5</button>
            <button onClick={() => modify('timerLength', '-', 1)}>-1</button>
            <p>{timerLength}</p>
            <button onClick={() => modify('timerLength', '+', 1)}>+1</button>
            <button onClick={() => modify('timerLength', '+', 5)}>+5</button>
            <button
                title="Start Game"
                className={`button button__stats ${currentTheme}`}
                onClick={() => viewPage('play')}
                >Start Game
            </button>
        </div>
    )
}