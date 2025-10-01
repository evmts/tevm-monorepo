import { argument } from 'pastel'
import { z } from 'zod'
import { generateRandomName } from './generateRandomName.js'

// Helper function to load options from environment variables
const envVar = (name: string, prefix = 'TEVM_') => {
	// Check import.meta.env first (for browser environments), then fall back to process.env
	const importMetaEnv = import.meta.env as Record<string, string | undefined>
	return importMetaEnv?.[`${prefix}${name.toUpperCase()}`] || process.env[`${prefix}${name.toUpperCase()}`]
}

const defaultName = envVar('name') || generateRandomName()

export const args = z.tuple([
	z
		.string()
		.optional()
		.default(defaultName)
		.describe(
			argument({
				name: 'name',
				description: 'The name of the application, as well as the name of the directory to create (env: TEVM_NAME)',
			}),
		),
])
