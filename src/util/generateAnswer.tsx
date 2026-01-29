import breakCategory from "./breakCategory"
import { Country } from "./interfaces"

export default function generateAnswer(category: string, countryAnswers: Country[]) {
  const [type, size] = breakCategory(category)
  let valArray: number[] = []
  let answer: number = 0

  countryAnswers.forEach((country) => {
    if (type === 'area' || type === 'population') {
      valArray.push(country[type])
    }
  })
  size === 'high'
      ? answer = Math.max(...valArray)
      : answer = Math.min(...valArray)
  return answer
}