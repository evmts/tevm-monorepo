import { z } from 'zod'
import { generateRandomName } from './utils/generateRandomName.js'

const defaultName = generateRandomName()

export const args = z.tuple([
	z
		.string()
		.optional()
		.default(defaultName)
		.describe('The name of the application, as well as the name of the directory to create'),
])
