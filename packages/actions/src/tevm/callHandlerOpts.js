import { EthjsAddress } from '@tevm/utils'
import { hexToBytes } from '@tevm/utils'

/**
 * Parses user provided params into ethereumjs options to pass into the EVM
 * @param {import('@tevm/actions-types').CallParams} params
 * @returns {Parameters<import('@tevm/evm').Evm['runCall']>[0]}
 */
export const callHandlerOpts = (params) => {
	/**
	 * @type {Parameters<import('@tevm/evm').Evm['runCall']>[0]}
	 */
	const opts = {}

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
