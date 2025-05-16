// Selects the question category
export default function generateCategory(category: string[]) {
  // Selects the category at random
  const categoryNum = Math.floor(Math.random() * categories.length)
  // Appends a unique ID so that if the same category is picked twice in a row it will still trigger the useEffect
  const categoryID = `${categories[categoryNum]}-${Date.now()}`
  return([...category, categoryID])
}

const categories = [
  'high-population',
  'low-population',
  'high-area',
  'low-area'
]