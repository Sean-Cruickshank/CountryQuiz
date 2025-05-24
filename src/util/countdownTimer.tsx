import React from "react";

export default function countdownTimer(seconds: number, setSeconds: React.Dispatch<React.SetStateAction<number>>) {

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(prev => prev - 1)
      } else {
        clearInterval(timer)
      }
    },1000)

    return () => clearInterval(timer)
  },[seconds])

  function formatTimer(time: number) {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0')
    const seconds = (time % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  console.log(seconds)

  return (
    <div>
      <p>{formatTimer(seconds)}</p>
      {seconds === 0 && <p>Time's up!</p>}
    </div>
  )
}