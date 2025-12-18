export function generateMeter(text: string, max: number, value: number) {
    const currentTheme = localStorage.getItem('theme') || 'blue'
    const title = max > 0
      ? `${text}: ${formatStats(value, max)} (${value}/${max})`
      : `${text}: ${formatStats(value, max)}`
    return (
        <div className="meterdiv">
            <p>{text}: {formatStats(value, max)} ({value}/{max})</p>
            <meter
                className={`meter ${currentTheme}`}
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