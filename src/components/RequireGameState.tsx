import { Navigate, useLocation } from "react-router-dom"
import { JSX } from "react"

export default function RequireGameState({ children }: { children: JSX.Element }) {
  const location = useLocation()

  if (!location.state) {
    return <Navigate to="/start" replace />
  }

  return children
}
