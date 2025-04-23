export default function convertToMiles(area) {
  return Number((area * 0.386102).toFixed(0)).toLocaleString()
}