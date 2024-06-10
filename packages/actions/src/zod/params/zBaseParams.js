import { z } from 'zod'

/**
 * Parameters shared across actions
 */
export const zBaseParams = z
	.object({
		throwOnFail: z
			.boolean()
			.optional()
			.describe(
				'If true the action handler will throw errors rather than returning errors an the `errors` property. Defaults to true.',
			),
	})
	.describe('Properties shared across actions')
