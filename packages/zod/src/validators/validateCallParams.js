import { createError } from '../common/index.js'
import { zCallParams } from '../params/index.js'
import { validateBaseCallParams } from './validateBaseCallParams.js'

/**
 * @param {import('@tevm/actions-types').CallParams} action
 */
export const validateCallParams = (action) => {
	/**
	 * @type {Array<import('@tevm/errors').CallError>}
	 */
	const errors = validateBaseCallParams(action)

	const parsedParams = zCallParams.safeParse(action)

	if (parsedParams.success === false) {
		const formattedErrors = parsedParams.error.format()

		if (formattedErrors.salt) {
			formattedErrors.salt._errors.forEach((error) => {
				errors.push(createError('InvalidSaltError', error, String(action.salt)))
			})
		}
		if (formattedErrors.data) {
			formattedErrors.data._errors.forEach((error) => {
				errors.push(createError('InvalidDataError', error, String(action.data)))
			})
		}
		if (formattedErrors.deployedBytecode) {
			formattedErrors.deployedBytecode._errors.forEach((error) => {
				errors.push(
					createError(
						'InvalidDeployedBytecodeError',
						error,
						String(action.deployedBytecode),
					),
				)
			})
		}
	}

	return errors
}
