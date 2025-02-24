import { createPublicClient, createTransport } from 'viem'

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
export const getForkClient = ({ options: { fork } }) => {
	if (!fork) {
		throw new NoForkError('Cannot initialize a client with no fork url set')
	}
	return createPublicClient({
		name: 'TevmStateManagerForkClient',
		transport: () =>
			createTransport({
				type: 'tevm',
				key: 'tevm',
				name: 'TevmStateManagerForkClientTransport',
				request: typeof fork.transport === 'function' ? fork.transport({}).request : fork.transport.request,
			}),
	})
}
