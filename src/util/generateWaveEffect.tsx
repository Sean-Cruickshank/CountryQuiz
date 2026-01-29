import { nanoid } from "nanoid"

export default function generateWaveEffect(message: string, effect: string) {
    let position = 1
    let wordSplit = message?.split(' ').map(word => {
        let letterSplit = word?.split('').map(letter => {
            position !== 6 ? position++ : position = 1
            return <span key={nanoid()} className={`pos-${position}`}>{letter}</span>
        })
        return <div key={nanoid()}>{letterSplit}</div>
    })
    if (effect === 'none') {
        return <div>{wordSplit}</div>
    }
    return <div className={`wave-effect--${effect}`}>{wordSplit}</div>
    
}