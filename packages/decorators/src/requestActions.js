import { requestBulkProcedure, requestProcedure } from '@tevm/procedures'

/**
 * @returns {import('@tevm/base-client').Extension<Pick<import('@tevm/client-types').TevmClient, 'request'>>}
 */
export const request = () => (client) => {
	return {
		request: requestProcedure(client),
	}
}

/**
 * @returns {import('@tevm/base-client').Extension<Pick<import('@tevm/client-types').TevmClient, 'requestBulk'>>}
 */
export const requestBulk = () => (client) => {
	return {
		requestBulk: requestBulkProcedure(client),
	}
}

/**
 * @returns {import('@tevm/base-client').Extension<Pick<import('@tevm/client-types').TevmClient, 'request' | 'requestBulk'>>}
 */
export const requestActions = () => (client) => {
	return client.extend(request()).extend(requestBulk())
}
