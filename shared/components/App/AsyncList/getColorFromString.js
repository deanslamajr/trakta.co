const colors = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'pink',
  'orange',
  'teal'
]

function getColorFromString (text) {
  const chars = text.split('')
  const charCodesSum = chars.reduce((sum, char) => char.charCodeAt() + sum, 0)
  const restrictedValue = charCodesSum % colors.length
  return colors[restrictedValue]
}

export default getColorFromString
