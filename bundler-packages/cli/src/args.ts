import { generateRandomName } from './utils/generateRandomName.js'
import { z } from 'zod'

const defaultName = generateRandomName()

export const args = z.tuple([
	z
		.string()
		.optional()
		.default(defaultName)
		.describe(
			'The name of the application, as well as the name of the directory to create',
		),
])
