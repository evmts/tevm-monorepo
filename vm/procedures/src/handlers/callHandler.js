import { Address as EthjsAddress, zeros } from '@ethereumjs/util'
import { validateCallParams } from '@tevm/zod'
import { getAddress, hexToBytes, toHex } from 'viem'

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
 * Creates an CallHandler for handling call params with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/api').CallHandler}
 */
export const callHandler = (evm) => async (action) => {
	const errors = validateCallParams(action)
	if (errors.length > 0) {
		return { errors, executionGasUsed: 0n, rawData: '0x' }
	}

	/**
	 * @type {Parameters<import('@ethereumjs/evm').EVM['runCall']>[0]}
	 */
	const opts = {}

	if (action.caller) {
		opts.caller = EthjsAddress.fromString(action.caller)
	}
	if (action.block) {
		opts.block = {
			header: {
				coinbase: action.block.coinbase
					? EthjsAddress.fromString(action.block.coinbase)
					: DEFAULT_BLOCK.header.coinbase,
				cliqueSigner: DEFAULT_BLOCK.header.cliqueSigner,
				getBlobGasPrice() {
					if (action.block?.blobGasPrice) {
						return BigInt(action.block.blobGasPrice)
					}
					return DEFAULT_BLOCK.header.getBlobGasPrice()
				},
				difficulty: action.block.difficulty
					? action.block.difficulty
					: DEFAULT_BLOCK.header.difficulty,
				gasLimit: action.block.gasLimit
					? action.block.gasLimit
					: DEFAULT_BLOCK.header.gasLimit,
				number: action.block.number
					? BigInt(action.block.number)
					: DEFAULT_BLOCK.header.number,
				prevRandao: DEFAULT_BLOCK.header.prevRandao,
				timestamp: action.block.timestamp
					? action.block.timestamp
					: DEFAULT_BLOCK.header.timestamp,
			},
		}
		if (action.block.baseFeePerGas) {
			opts.block.header.baseFeePerGas = BigInt(action.block.baseFeePerGas)
		}
	}
	if (action.to) {
		opts.to = EthjsAddress.fromString(action.to)
	}
	if (action.data) {
		opts.data = hexToBytes(action.data)
	}
	if (action.salt) {
		opts.salt = Buffer.from(action.salt, 'hex')
	}
	if (action.depth) {
		opts.depth = action.depth
	}
	if (action.blobVersionedHashes) {
		opts.blobVersionedHashes = action.blobVersionedHashes.map((hash) =>
			Buffer.from(hash, 'hex'),
		)
	}
	if (action.deployedBytecode) {
		opts.code = Buffer.from(action.deployedBytecode, 'hex')
	}
	if (action.selfdestruct) {
		opts.selfdestruct = action.selfdestruct
	}
	if (action.skipBalance) {
		opts.skipBalance = action.skipBalance
	}
	if (action.gasRefund) {
		opts.gasRefund = BigInt(action.gasRefund)
	}
	if (action.gasPrice) {
		opts.gasPrice = BigInt(action.gasPrice)
	}
	if (action.value) {
		opts.value = BigInt(action.value)
	}
	if (action.origin) {
		opts.origin = EthjsAddress.fromString(action.origin)
	}
	if (action.gasLimit) {
		opts.gasLimit = BigInt(action.gasLimit)
	}

	console.log('running with opts', opts)
	const runCallResult = await evm.runCall(opts)
	console.log(
		runCallResult.execResult.returnValue,
		toHex(runCallResult.execResult.returnValue),
	)

	/**
	 * @type {import('@tevm/api').CallResult}
	 */
	const out = {
		rawData: toHex(runCallResult.execResult.returnValue),
		executionGasUsed: runCallResult.execResult.executionGasUsed,
	}

	if (runCallResult.execResult.gasRefund) {
		out.gasRefund = runCallResult.execResult.gasRefund
	}
	if (runCallResult.execResult.selfdestruct) {
		out.selfdestruct = new Set(
			[...runCallResult.execResult.selfdestruct].map((address) =>
				getAddress(address),
			),
		)
	}
	if (runCallResult.execResult.gas) {
		out.gas = runCallResult.execResult.gas
	}
	if (runCallResult.execResult.logs) {
		// type Log = [address: Address, topics: Hex[], data: Hex]
		out.logs = runCallResult.execResult.logs.map((log) => {
			const [address, topics, data] = log
			return {
				address: getAddress(toHex(address)),
				topics: topics.map((topic) => toHex(topic)),
				data: toHex(data),
			}
		})
	}
	if (runCallResult.execResult.runState) {
		// don't do anything with runState atm
	}
	if (runCallResult.execResult.blobGasUsed) {
		out.blobGasUsed = runCallResult.execResult.blobGasUsed
	}
	if (runCallResult.execResult.exceptionError) {
		out.errors = [
			{
				name: runCallResult.execResult.exceptionError.error,
				_tag: runCallResult.execResult.exceptionError.error,
				message: 'There was an error executing the evm',
			},
		]
	}

	if (runCallResult.execResult.createdAddresses) {
		out.createdAddresses = new Set(
			[...runCallResult.execResult.createdAddresses].map(getAddress),
		)
	}

	return out
}
