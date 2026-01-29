export default function generateCategory(category: string[]) {
  const categoryNum = Math.floor(Math.random() * categories.length)
  const categoryID = `${categories[categoryNum]}-${Date.now()}`
  return([...category, categoryID])
}

const categories = [
  'high-population',
  'low-population',
  'high-area',
  'low-area'
]