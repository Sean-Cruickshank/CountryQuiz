import { nanoid } from "nanoid";
import React, { JSX } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useOutletContext } from "react-router-dom";

interface headerProps {
  title: string,
  width: number
}

interface LogProps {
  headers: headerProps[],
  content: (JSX.Element | undefined)[],
  lastPage: number
}

export default function Log({ headers, content, lastPage } : LogProps) {
    
  const context: {theme: string, indicator: string, unit: string} = useOutletContext()
  
  const preferences = {
    theme : context ? context.theme : 'blue',
    indicator : context ? context.indicator : 'greenred',
    unit : context ? context.unit : 'metric'
  }

  const [page, setPage] = React.useState(0)
  const [selectedLog, setSelectedLog] = React.useState(content.slice(page * 10, (page + 1) * 10))

  React.useEffect(() => {
    setSelectedLog(content.slice(page * 10, (page + 1) * 10))
  },[page])

  function changePage(type: string) {
    type === '+' && page + 1 < lastPage && setPage(prev => prev + 1)
    type === '-' && page > 0 && setPage(prev => prev - 1)
  }


  return (
    <div className={`log ${preferences.theme}`}>
      <table>
        <thead>
          <tr>
            {headers.map(header => <th style={{ width: `${header.width}%` }} key={nanoid()}>{header.title}</th>)}
          </tr>
        </thead>
        <tbody>
          {selectedLog}
        </tbody>
      </table>
      {lastPage > 1 && <div className="pagination">
        <button
        className={`button pagination__button ${preferences.theme}`}
        onClick={() => changePage('-')}
        ><MdKeyboardArrowLeft /></button>
        <p>{page + 1} / {lastPage}</p>
        <button
        className={`button pagination__button ${preferences.theme}`}
        onClick={() => changePage('+')}
        ><MdKeyboardArrowRight /></button>
      </div>}
    </div>
  )
}