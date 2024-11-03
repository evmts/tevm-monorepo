import { createAddress } from '@tevm/address'
import { createImpersonatedTx } from '@tevm/tx'

/**
 * @param {import('@tevm/node').TevmNode} client
 */
export const evmInputToImpersonatedTx = (client) => {
	/**
	 * @param {import('@tevm/evm').EvmRunCallOpts} evmInput
	 * @param {bigint } [maxFeePerGas]
	 * @param {bigint } [maxPriorityFeePerGas]
	 */
	return async (evmInput, maxFeePerGas, maxPriorityFeePerGas) => {
		const vm = await client.getVm()

		const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
		const priorityFee = 0n

		const sender = evmInput.origin ?? evmInput.caller ?? createAddress(`0x${'00'.repeat(20)}`)

		const txPool = await client.getTxPool()
		const txs = await txPool.getBySenderAddress(sender)

		const nonce = ((await vm.stateManager.getAccount(sender)) ?? { nonce: 0n }).nonce + BigInt(txs.length)

		client.logger.debug({ nonce, sender: sender.toString() }, 'creating tx with nonce')

		let _maxFeePerGas = parentBlock.header.calcNextBaseFee() + priorityFee
		const baseFeePerGas = parentBlock.header.baseFeePerGas ?? 0n
		if (_maxFeePerGas < baseFeePerGas) {
			_maxFeePerGas = baseFeePerGas
		}
		if (maxPriorityFeePerGas && _maxFeePerGas < maxPriorityFeePerGas) {
			_maxFeePerGas = maxPriorityFeePerGas
		}

		// TODO we should be allowing actual real signed tx too here
		// TODO known bug here we should be allowing unlimited code size here based on user providing option
		// Just lazily not looking up how to get it from client.getVm().evm yet
		// Possible we need to make property public on client
		return createImpersonatedTx(
			{
				impersonatedAddress: sender,
				nonce,
				// just set to block max for now
				gasLimit: parentBlock.header.gasLimit,
				maxFeePerGas: maxFeePerGas ?? _maxFeePerGas,
				maxPriorityFeePerGas: maxPriorityFeePerGas ?? 0n,
				...(evmInput.to !== undefined ? { to: evmInput.to } : {}),
				...(evmInput.data !== undefined ? { data: evmInput.data } : {}),
				...(evmInput.value !== undefined ? { value: evmInput.value } : {}),
				gasPrice: null,
			},
			{
				allowUnlimitedInitCodeSize: false,
				common: vm.common.vmConfig,
				// we don't want to freeze because there is a hack to set tx.hash when building a block
				freeze: false,
			},
		)
	}
}
