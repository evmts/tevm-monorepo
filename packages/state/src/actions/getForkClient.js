import { http, createPublicClient } from 'viem'

export class NoForkError extends Error {
	/**
	 * @override
	 * @type {'NoForkError'}
	 */
	name = 'NoForkError'
	/**
	 * @type {'NoForkError'}
	 */
	_tag = 'NoForkError'
}

/**
 * Creates a viem public client for the fork
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {import('viem').PublicClient}
 */
export const getForkClient = ({ _options: { fork } }) => {
	if (!fork) {
		throw new NoForkError('Cannot initialize a client with no fork url set')
	}
	return createPublicClient({
		transport: http(fork.url),
		name: 'tevm-state-manager-viem-client',
	})
}
