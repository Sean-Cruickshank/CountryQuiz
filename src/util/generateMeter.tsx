import { useOutletContext } from "react-router-dom"

export function generateMeter(text: string, max: number, value: number) {
  const context: {theme: string, indicator: string, unit: string} = useOutletContext()
  
  const preferences = {
    theme : context ? context.theme : 'blue',
    indicator : context ? context.indicator : 'greenred',
    unit : context ? context.unit : 'metric'
  }

  const maxVal = max > 0 ? max : 1
  const fillVal = (value / maxVal) * 100
  
    // return (
    //     <div className="meterdiv">
    //         <p>{text}: {formatStats(value, max)} ({value}/{max})</p>
    //         <meter
    //             className={`meter ${preferences.theme}`}
    //             value={value}
    //             max={max > 0 ? max : 1}
    //         ></meter>
    //   </div>
    // )

    return (
      <div className="meterdiv">
        <p>{text}: {formatStats(value, max)} ({value}/{max})</p>
        <div
          className={`new-meter ${preferences.theme}`}
          aria-valuemin={0} aria-valuemax={maxVal} aria-valuenow={fillVal}>
          <div className="new-meter__fill" style={{width: `${fillVal}%`}}></div>
        </div>
      </div>
    )
}

export function formatStats(a: number, q: number): string {
  if (q > 0) {
    return `${((a / q) * 100).toFixed(0)}%`
  } else return 'N/A'
}