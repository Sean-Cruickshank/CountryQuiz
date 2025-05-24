import breakCategory from "./breakCategory"

// Generates the question title based on the category selected
export default function generateTitle(num: number, category: string[]) {
  if (category.length > 0) {
    const [type, size] = breakCategory(category[category.length - num])
    const typeText = type === 'population' ? 'population' : 'land area'
    const sizeText = size === 'high' ? 'largest' : 'smallest'
    return <p>Guess the country with the <i>{sizeText} {typeText}!</i></p>
  }
}