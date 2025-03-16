import { createAddress } from '@tevm/address'
import { InvalidBlockError, InvalidParamsError, UnknownBlockError } from '@tevm/errors'
import { hexToBytes } from '@tevm/utils'

/**
 * @internal
 * @typedef {import('./CallHandlerOptsError.js').CallHandlerOptsError} CallHandlerOptsError
 */

/**
 * @internal
 * Parses user provided params into ethereumjs options to pass into the EVM
 * @param {import('@tevm/node').TevmNode} client
 * @param {import('./CallParams.js').CallParams} params
 * @returns {Promise<{data: Parameters<import('@tevm/evm').Evm['runCall']>[0], errors?: never} | {data?: never, errors: Array<CallHandlerOptsError>}>}
 * @throws { never } Returns all errors as values
 */
export const callHandlerOpts = async (client, params) => {
	/**
	 * @type {Parameters<import('@tevm/evm').Evm['runCall']>[0]}
	 */
	const opts = {}
	const vm = await client.getVm()

	// TODO need better error handling here
	const block = await (async () => {
		try {
			if (params.blockTag === undefined) {
				return vm.blockchain.blocksByTag.get('latest')
			}
			if (typeof params.blockTag === 'bigint') {
				return await vm.blockchain.getBlock(params.blockTag)
			}
			if (typeof params.blockTag === 'string' && params.blockTag.startsWith('0x')) {
				return await vm.blockchain.getBlock(hexToBytes(/** @type {import('@tevm/utils').Hex}*/ (params.blockTag)))
			}
			// TODO support all these and resolve all of them both vs fork and non fork
			if (
				params.blockTag === 'latest' ||
				params.blockTag === 'safe' ||
				params.blockTag === 'pending' ||
				params.blockTag === 'earliest' ||
				params.blockTag === 'finalized'
			) {
				return vm.blockchain.blocksByTag.get(
					/** @type {'latest' | 'safe' | 'pending' | 'earliest' | 'finalized'} */ (params.blockTag),
				)
			}
			return new InvalidBlockError(`Unknown blocktag ${params.blockTag}`)
		} catch (e) {
			return new UnknownBlockError(e instanceof Error ? e.message : `Unable to find block ${params.blockTag}`)
		}
	})()
	if (block instanceof UnknownBlockError || block instanceof InvalidBlockError || block === undefined) {
		return { errors: [block ?? new UnknownBlockError(`Unable to find block ${params.blockTag}`)] }
	}

	client.logger.debug({ block: block.header }, 'Using block')

	opts.block = block

	// handle block overrides
	if (params.blockOverrideSet) {
		client.logger.debug(params.blockOverrideSet, 'callHandlerOpts: Detected a block override set')
		// TODO this is a known bug we need to implement better support for block tags
		// We are purposefully ignoring this until the block creation is implemented
		const { header } = await vm.blockchain.getCanonicalHeadBlock()
		opts.block = {
			...opts.block,
			header: {
				// this isn't in the type but it needs to be here or else block overrides will fail
				...{ stateRoot: block.header.stateRoot },
				coinbase:
					params.blockOverrideSet.coinbase !== undefined
						? createAddress(params.blockOverrideSet.coinbase)
						: header.coinbase,
				number: params.blockOverrideSet.number !== undefined ? BigInt(params.blockOverrideSet.number) : header.number,
				difficulty: header.difficulty,
				prevRandao: header.prevRandao,
				gasLimit:
					params.blockOverrideSet.gasLimit !== undefined ? BigInt(params.blockOverrideSet.gasLimit) : header.gasLimit,
				timestamp: params.blockOverrideSet.time !== undefined ? BigInt(params.blockOverrideSet.time) : header.timestamp,
				baseFeePerGas:
					params.blockOverrideSet.baseFee !== undefined
						? BigInt(params.blockOverrideSet.baseFee)
						: header.baseFeePerGas || BigInt(0),
				cliqueSigner() {
					return header.cliqueSigner()
				},
				getBlobGasPrice() {
					if (params.blockOverrideSet?.blobBaseFee !== undefined) {
						return BigInt(params.blockOverrideSet.blobBaseFee)
					}
					// Handle case where header.getBlobGasPrice might be undefined
					const blobGasPrice = header.getBlobGasPrice()
					return typeof blobGasPrice === 'undefined' ? BigInt(1) : blobGasPrice
				},
			},
		}
	}

	if (params.to) {
		opts.to = createAddress(params.to)
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
		opts.blobVersionedHashes = params.blobVersionedHashes.map((hash) => hexToBytes(hash))
	}
	if (params.selfdestruct) {
		opts.selfdestruct = params.selfdestruct
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
	const caller =
		params.caller ||
		params.from ||
		params.origin ||
		(params.createTransaction ? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' : `0x${'00'.repeat(20)}`)
	if (caller) {
		opts.caller = createAddress(caller)
	}
	const origin =
		params.origin ||
		params.from ||
		(params.createTransaction ? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' : `0x${'00'.repeat(20)}`)
	if (origin) {
		if (params.skipBalance !== undefined) {
			opts.skipBalance = Boolean(params.skipBalance)
		} else {
			opts.skipBalance = caller === `0x${'00'.repeat(20)}` && (params.createTransaction ?? false) === false
		}
		opts.origin = createAddress(origin)
	}
	if (params.gas) {
		opts.gasLimit = BigInt(params.gas)
	}

	if (params.createTransaction && opts.block !== (await vm.blockchain.getCanonicalHeadBlock())) {
		return { errors: [new InvalidParamsError('Creating transactions on past blocks is not currently supported')] }
	}

	return { data: opts }
}
// 36,45-46,84,90
