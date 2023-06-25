import type typescript from 'typescript/lib/tsserverlibrary'
import { z } from 'zod'

export const configValidator = z.object({
	/**
	 * The name of the plugin
	 */
	name: z.literal('@evmts/ts-plugin').describe('The name of the plugin'),
	out: z.string().optional().default('out').describe('The output directory'),
	project: z
		.string()
		.optional()
		.default('.')
		.transform((value) => {
			if (value === 'foundry.toml') {
				return '.'
			}
			const endsWithRegex = /\/foundry\.toml$/
			if (endsWithRegex.test(value)) {
				return value.replace(/\/foundry\.toml$/, '')
			}
			return value
		})
		.describe('Location relative to tsconfig.json of the `foundry.toml`'),
})

/**
 * Plugin options passed into ts-plugin
 * @see {@link createConfig}
 */
export type Config = z.infer<typeof configValidator>

/**
 * Creates a validated config object from the createInfo passed into the plugin
 * @param createOptions
 */
export const createConfig = (
	createOptions: typescript.server.PluginCreateInfo,
): Config => {
	return createOptions.config
}
