export default function generateWaveEffect(message: string, effect: string) {
    let position = 1
    let messageSpan = message?.split('').map(letter => {
        position !== 6 ? position++ : position = 1
        if (letter === ' ') return <span className={`pos-${position}`}>&nbsp;</span>
        else return <span className={`pos-${position}`}>{`${letter}`}</span>
    })
    if (effect === 'none') {
        return <div><b>{messageSpan}</b></div>
    }
    return <div className={`wave-effect--${effect}`}><b>{messageSpan}</b></div>
    
}