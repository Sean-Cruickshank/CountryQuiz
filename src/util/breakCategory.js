export default function breakCategory(category) {
  const size = category.split('-')[0]  
  const type = category.split('-')[1]
  return [type, size]
  }