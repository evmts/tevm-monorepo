import { Address as EthjsAddress } from '@ethereumjs/util'
import { hexToBytes } from 'viem'

/**
 * @typedef {Parameters<import('@ethereumjs/evm').EVM['runCall']>[0]} EthRunCallParams
 */

/**
 * Parses user provided params into ethereumjs options to pass into the EVM
 * @param {import('@tevm/actions-types').CallParams} params
 * @returns {EthRunCallParams}
 */
export const callHandlerOpts = (params) => {
	/**
	 * @type {Parameters<import('@ethereumjs/evm').EVM['runCall']>[0]}
	 */
	const opts = {}

	if (params.blockTag) {
		console.error(
			'blockTag is not currently implemented and thats not intentional!!!',
		)
	}
	if (params.to) {
		opts.to = EthjsAddress.fromString(params.to)
	}
	if (params.data) {
		opts.data = hexToBytes(params.data)
	}
	if (params.salt) {
		opts.salt = hexToBytes(params.salt)
	}
	if (params.depth) {
		opts.depth = params.depth
	}
	if (params.blobVersionedHashes) {
		opts.blobVersionedHashes = params.blobVersionedHashes.map((hash) =>
			hexToBytes(hash),
		)
	}
	if (params.selfdestruct) {
		opts.selfdestruct = params.selfdestruct
	}
	if (params.skipBalance) {
		opts.skipBalance = Boolean(params.skipBalance)
	} else if (!params.from && !params.caller) {
		// skip balance if no caller provided and just using the 0 address
		opts.skipBalance = true
	}
	if (params.gasRefund) {
		opts.gasRefund = BigInt(params.gasRefund)
	}
	if (params.gasPrice) {
		opts.gasPrice = BigInt(params.gasPrice)
	}
	if (params.value) {
		opts.value = BigInt(params.value)
	}
	const caller = params.caller || params.from
	if (caller) {
		opts.caller = EthjsAddress.fromString(caller)
	}
	const origin = params.origin || params.from
	if (origin) {
		opts.origin = EthjsAddress.fromString(origin)
	}
	if (params.gas) {
		opts.gasLimit = BigInt(params.gas)
	}

	return opts
}
