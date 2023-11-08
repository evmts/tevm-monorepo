import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'

export const generateRandomName = () => {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  })
}

