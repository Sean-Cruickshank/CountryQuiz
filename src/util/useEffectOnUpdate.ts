import React from "react"

export default function useEffectOnUpdate(
  effectFunction: () => void,
  deps: string[][]
) {
  const firstRender = React.useRef(true)
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
    } else {
      effectFunction()
    }
  }, deps)
}