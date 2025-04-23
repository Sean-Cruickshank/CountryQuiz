export default function breakCategory(category: string): ['population' | 'area', 'high' | 'low'] {
  let type: 'area' | 'population'
  let typeSplit = category.split('-')[1]

  if (typeSplit === 'area' || typeSplit === 'population') {
    type = typeSplit
  } else {
    type = 'population'
    console.error('Invalid type detected in breakCategory.ts')
  }
  
  let size : 'high' | 'low'
  let sizeSplit = category.split('-')[0]  

  if (sizeSplit === 'high' || sizeSplit === 'low') {
    size = sizeSplit
  } else {
    size = 'high'
    console.error('Invalid size detected in breakCategory.ts')
  }
  return [type, size]
  }