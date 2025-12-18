import React, { JSX } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface PaginationProps {
  pageContent: (JSX.Element | undefined)[],
  lastPage: number
}

export default function Pagination({ pageContent, lastPage } : PaginationProps) {
    
  const currentTheme = localStorage.getItem('theme') || 'blue'

  const [page, setPage] = React.useState(0)
  const [selectedLog, setSelectedLog] = React.useState(pageContent.slice(page * 10, (page + 1) * 10))

  React.useEffect(() => {
    setSelectedLog(pageContent.slice(page * 10, (page + 1) * 10))
  },[page])

  function changePage(type: string) {
    type === '+' && page + 1 < lastPage && setPage(prev => prev + 1)
    type === '-' && page > 0 && setPage(prev => prev - 1)
  }

  return (
    <>
      <div className="log__entries">
            {selectedLog}
          </div>
      {lastPage > 1 && <div className="pagination">
        <button
        className={`button pagination__button ${currentTheme}`}
        onClick={() => changePage('-')}
        ><MdKeyboardArrowLeft /></button>
        <p>{page + 1} / {lastPage}</p>
        <button
        className={`button pagination__button ${currentTheme}`}
        onClick={() => changePage('+')}
        ><MdKeyboardArrowRight /></button>
      </div>}
    </>
  )
}