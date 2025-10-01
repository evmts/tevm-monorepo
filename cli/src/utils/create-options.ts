import { option } from 'pastel'
import { z } from 'zod'

// Helper function to load options from environment variables
const envVar = (name: string, prefix = 'TEVM_') => {
	// Check import.meta.env first (for browser environments), then fall back to process.env
	const importMetaEnv = import.meta.env as Record<string, string | undefined>
	return importMetaEnv?.[`${prefix}${name.toUpperCase()}`] || process.env[`${prefix}${name.toUpperCase()}`]
}

export const options = z.object({
	skipPrompts: z
		.boolean()
		.default(envVar('skip_prompts') === 'true' || false)
		.describe(
			option({
				description: 'Bypass interactive CLI prompt and use only command line flag options (env: TEVM_SKIP_PROMPTS)',
			}),
		),
	template: z
		.enum(['hardhat', 'foundry'])
		.default((envVar('template') as 'hardhat' | 'foundry' | undefined) || 'hardhat')
		.describe(
			option({
				description: 'Project template to use (env: TEVM_TEMPLATE)',
				defaultValueDescription: 'hardhat',
			}),
		),
})
