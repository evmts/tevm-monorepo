/**
 * @module validateSimulateParams
 */

import { zSimulateParams } from '../internal/validators/zSimulateParams.js'

/**
 * Validates simulate parameters
 * @param {import('../../types/SimulateParams.js').SimulateParams} params - Parameters to validate
 * @returns {{isValid: boolean, errors?: Array<{path: string, message: string}>}}
 */
export const validateSimulateParams = (params) => {
	try {
		zSimulateParams.parse(params)
		return { isValid: true }
	} catch (e) {
		return {
			isValid: false,
			errors: e.errors.map((error) => ({
				path: error.path.join('.'),
				message: error.message,
			})),
		}
	}
}
