import { zNetworkConfig } from '../common/index.js'

/**
 * Zod validator for a valid `tevm_fork` action
 */
export const zForkParams = zNetworkConfig
	.extend({})
	.describe('Valid tevm_fork action params')
