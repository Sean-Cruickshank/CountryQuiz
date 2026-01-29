import breakCategory from "./breakCategory"

export default function generateTitle(num: number, category: string[]) {
  if (category.length - num < 0) return null
  if (category.length > 0) {
    const [type, size] = breakCategory(category[category.length - num])
    const typeText = type === 'population' ? 'population' : 'land area'
    const sizeText = size === 'high' ? 'largest' : 'smallest'
    return <>Guess the country with the <i>{sizeText} {typeText}!</i></>
  }
}