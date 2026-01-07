import { createForkRpcClient } from '@tevm/utils'

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
 * Creates a fork RPC client for fetching state from a remote chain.
 * Uses the native createForkRpcClient adapter instead of viem.
 * The transport is lazily evaluated to avoid breaking when the transport
 * is malformed until it's actually needed.
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {import('@tevm/utils').ForkRpcClient}
 */
export const getForkClient = ({ options: { fork } }) => {
	if (!fork) {
		throw new NoForkError('Cannot initialize a client with no fork url set')
	}
	// Pass a factory function for lazy evaluation
	// This matches viem's behavior where the transport isn't created until first request
	const transportFactory = () => {
		return typeof fork.transport === 'function' ? fork.transport({}) : fork.transport
	}
	return createForkRpcClient(transportFactory)
}
