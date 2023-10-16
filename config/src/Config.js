import { getDefaultSolcVersion } from './getDefaultSolcVersion.js'
import { z } from 'zod'

export const CompilerConfigValidator = z
	.strictObject({
		name: z.literal('@evmts/ts-plugin').optional(),
		solcVersion: z.string().optional(),
		foundryProject: z.union([z.boolean(), z.string()]).optional(),
		libs: z.array(z.string()).optional(),
		remappings: z.record(z.string()).optional(),
	})
	.describe('Configuration for EVMts')

export const defaultConfig = {
	get solcVersion() {
		return getDefaultSolcVersion()
	},
	foundryProject: false,
	remappings: {},
	libs: [],
}
