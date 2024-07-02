import { InvalidBlockError, InvalidParamsError, UnknownBlockError } from '@tevm/errors'
import { EthjsAddress } from '@tevm/utils'
import { hexToBytes } from '@tevm/utils'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'

/**
 * @internal
 * @typedef {UnknownBlockError | UnknownBlockError | InvalidParamsError} CallHandlerOptsError
 */

/**
 * @internal
 * Parses user provided params into ethereumjs options to pass into the EVM
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {import('./CallParams.js').CallParams} params
 * @returns {Promise<{data?: Parameters<import('@tevm/evm').Evm['runCall']>[0], errors?: Array<CallHandlerOptsError>}>}
 * @throws { never } Returns all errors as values
 */
export const callHandlerOpts = async (client, params) => {
	/**
	 * @type {Parameters<import('@tevm/evm').Evm['runCall']>[0]}
	 */
	const opts = {}
	const vm = await client.getVm()

	// TODO need better error handling here
	const block = await (() => {
		if (params.blockTag === undefined) {
			return vm.blockchain.blocksByTag.get('latest')
		}
		if (typeof params.blockTag === 'bigint') {
			return vm.blockchain.getBlock(params.blockTag)
		}
		if (typeof params.blockTag === 'string' && params.blockTag.startsWith('0x')) {
			return vm.blockchain.getBlock(hexToBytes(/** @type {import('@tevm/utils').Hex}*/ (params.blockTag)))
		}
		// TODO support all these and resolve all of them both vs fork and non fork
		if (
			params.blockTag === 'latest' ||
			params.blockTag === 'safe' ||
			params.blockTag === 'pending' ||
			params.blockTag === 'earliest' ||
			params.blockTag === 'finalized'
		) {
			return vm.blockchain.blocksByTag.get(/** */ params.blockTag)
		}
		return new InvalidBlockError(`Unknown blocktag ${params.blockTag}`)
	})()
	if (block === undefined) {
		// TODO need better error handling here
		return { errors: [new UnknownBlockError('No block found')] }
	}
	if (block instanceof Error) {
		return { errors: [block] }
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
				coinbase:
					params.blockOverrideSet.coinbase !== undefined
						? EthjsAddress.fromString(params.blockOverrideSet.coinbase)
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
						: header.baseFeePerGas ?? BigInt(0),
				cliqueSigner() {
					return EthjsAddress.fromString(`0x${'00'.repeat(20)}`)
				},
				getBlobGasPrice() {
					if (params.blockOverrideSet?.blobBaseFee !== undefined) {
						return BigInt(params.blockOverrideSet.blobBaseFee)
					}
					return header.getBlobGasPrice()
				},
			},
		}
	}

	// handle state overrides
	if (params.stateOverrideSet) {
		client.logger.debug(params.stateOverrideSet, 'callHandlerOpts: Detected a stateOverrideSet')
		for (const [address, state] of Object.entries(params.stateOverrideSet)) {
			const res = await setAccountHandler(client)({
				address: /** @type import('@tevm/utils').Address*/ (address),
				...(state.nonce !== undefined ? { nonce: state.nonce } : {}),
				...(state.balance !== undefined ? { balance: state.balance } : {}),
				...(state.code !== undefined ? { code: state.code } : {}),
				...(state.state !== undefined ? { state: state.state } : {}),
				...(state.stateDiff !== undefined ? { stateDiff: state.stateDiff } : {}),
				throwOnFail: false,
			})
			if (res.errors?.length) {
				return {
					errors: [
						new InvalidParamsError('Invalid state override', {
							cause: /** @type {Error} */ (res.errors.length === 1 ? res.errors[0] : new AggregateError(res.errors)),
						}),
					],
				}
			}
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
		opts.caller = EthjsAddress.fromString(caller)
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
		opts.origin = EthjsAddress.fromString(origin)
	}
	if (params.gas) {
		opts.gasLimit = BigInt(params.gas)
	}

	if (params.createTransaction && opts.block !== (await vm.blockchain.getCanonicalHeadBlock())) {
		throw new Error('Creating transactions on past blocks is not currently supported')
	}

	return { data: opts }
}
