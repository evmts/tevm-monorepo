import { zBlockParam } from '@tevm/actions'
import { z } from 'zod'

// Define options using zod
export const options = z.strictObject({
	preset: z
		.string()
		.default('900')
		.transform((id) => {
			return Number.parseInt(id)
		})
		.describe('use known chain id'),
	forkUrl: z.string().optional().describe('set fork URL'),
	block: zBlockParam.transform((block) => {
		if (
			typeof block === 'string' &&
			block.startsWith('0x') &&
			block.length !== 66
		) {
			return BigInt(Number.parseInt(block))
		}

		if (typeof block === 'number') {
			return BigInt(block)
		}
		return block
	}),
	host: z.string().default('localhost').describe('set host'),
	port: z.string().default('8545').describe('set port'),
	loggingLevel: z
		.union([
			z.literal('trace'),
			z.literal('debug'),
			z.literal('info'),
			z.literal('warn'),
			z.literal('error'),
		])
		.default('warn')
		.describe('set logging level'),
})
