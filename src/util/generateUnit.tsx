export default function generateUnit(value: number, unit: string): string {
    if (unit === 'imperial') return `${Number((value * 0.386102).toFixed(0)).toLocaleString()}mi²`
    if (unit === 'both') return `${value.toLocaleString()}km² (${Number((value * 0.386102).toFixed(0)).toLocaleString()}mi²)`
    return `${value.toLocaleString()}km²`
}