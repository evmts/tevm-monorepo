import { validateForkParams } from '@tevm/zod'

/**
 * Creates an {@link import('@tevm/actions-types').ForkHandler} for creating new forks
 * @param {import('./ForkOptions.js').ForkOptions} options
 * @returns {import('@tevm/actions-types').ForkHandler}
 */
export const forkHandler =
	({ register }) =>
	async (params) => {
		const errors = validateForkParams(params)
		if (errors.length > 0) {
			return { errors }
		}

		try {
			const forkId = await register(params)
			return { forkId }
		} catch (e) {
			return {
				errors: [
					{
						name: 'UnexpectedError',
						_tag: 'UnexpectedError',
						message:
							typeof e === 'string'
								? e
								: e instanceof Error
								? e.message
								: 'unknown error',
					},
				],
			}
		}
	}
