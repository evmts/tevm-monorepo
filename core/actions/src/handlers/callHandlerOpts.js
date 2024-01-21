import { Address as EthjsAddress, zeros } from '@ethereumjs/util'
import { hexToBytes } from 'viem'

const DEFAULT_BLOCK = {
	header: {
		number: 0n,
		cliqueSigner: () => EthjsAddress.zero(),
		coinbase: EthjsAddress.zero(),
		timestamp: 0n,
		difficulty: 0n,
		prevRandao: zeros(32),
		gasLimit: 0n,
		baseFeePerGas: undefined,
		getBlobGasPrice: () => undefined,
	},
}

/**
 * Parses user provided params into ethereumjs options to pass into the EVM
 * @param {import('@tevm/actions-spec').CallParams} params
 * @returns {Parameters<import('@ethereumjs/evm').EVM['runCall']>[0]}
 */
export const callHandlerOpts = (params) => {
	/**
	 * @type {Parameters<import('@ethereumjs/evm').EVM['runCall']>[0]}
	 */
	const opts = {}

	if (params.caller) {
		opts.caller = EthjsAddress.fromString(params.caller)
	}
	if (params.block) {
		opts.block = {
			header: {
				coinbase: params.block.coinbase
					? EthjsAddress.fromString(params.block.coinbase)
					: DEFAULT_BLOCK.header.coinbase,
				cliqueSigner: DEFAULT_BLOCK.header.cliqueSigner,
				getBlobGasPrice() {
					if (params.block?.blobGasPrice) {
						return BigInt(params.block.blobGasPrice)
					}
					return DEFAULT_BLOCK.header.getBlobGasPrice()
				},
				difficulty: params.block.difficulty
					? params.block.difficulty
					: DEFAULT_BLOCK.header.difficulty,
				gasLimit: params.block.gasLimit
					? params.block.gasLimit
					: DEFAULT_BLOCK.header.gasLimit,
				number: params.block.number
					? BigInt(params.block.number)
					: DEFAULT_BLOCK.header.number,
				prevRandao: DEFAULT_BLOCK.header.prevRandao,
				timestamp: params.block.timestamp
					? params.block.timestamp
					: DEFAULT_BLOCK.header.timestamp,
			},
		}
		if (params.block.baseFeePerGas) {
			opts.block.header.baseFeePerGas = BigInt(params.block.baseFeePerGas)
		}
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
	if (params.origin) {
		opts.origin = EthjsAddress.fromString(params.origin)
	}
	if (params.gasLimit) {
		opts.gasLimit = BigInt(params.gasLimit)
	}

	return opts
}
