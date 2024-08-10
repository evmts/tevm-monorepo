import {
	adjectives,
	animals,
	colors,
	uniqueNamesGenerator,
} from 'unique-names-generator'

export const generateRandomName = () => {
	return uniqueNamesGenerator({
		dictionaries: [adjectives, colors, animals],
	})
}
