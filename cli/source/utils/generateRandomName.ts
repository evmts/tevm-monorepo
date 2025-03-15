const adjectives = [
  'autumn', 'hidden', 'bitter', 'misty', 'silent',
  'empty', 'dry', 'dark', 'summer', 'icy', 'delicate',
  'quiet', 'white', 'cool', 'spring', 'winter',
  'patient', 'twilight', 'dawn', 'crimson', 'wispy',
  'weathered', 'blue', 'billowing', 'broken', 'cold',
  'falling', 'frosty', 'green', 'long'
]

const nouns = [
  'waterfall', 'river', 'breeze', 'moon', 'rain',
  'wind', 'sea', 'morning', 'snow', 'lake', 'sunset',
  'pine', 'shadow', 'leaf', 'dawn', 'glitter', 'forest',
  'hill', 'cloud', 'meadow', 'sun', 'glade', 'bird',
  'brook', 'butterfly', 'bush', 'dew', 'dust', 'field',
  'fire', 'flower'
]

export const generateRandomName = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adjective}-${noun}`
} 