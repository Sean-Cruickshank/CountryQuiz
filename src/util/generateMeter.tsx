import { useOutletContext } from "react-router-dom"

export function generateMeter(text: string, max: number, value: number) {
  const context: {theme: string, indicator: string} = useOutletContext()
  const theme = context ? context.theme : 'blue'
    return (
        <div className="meterdiv">
            <p>{text}: {formatStats(value, max)} ({value}/{max})</p>
            <meter
                className={`meter ${theme}`}
                value={value}
                max={max > 0 ? max : 1}
            ></meter>
      </div>
    )
}

export function formatStats(a: number, q: number): string {
  if (q > 0) {
    return `${((a / q) * 100).toFixed(0)}%`
  } else return 'N/A'
}