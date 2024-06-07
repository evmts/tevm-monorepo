import { createImpersonatedTx } from '@tevm/tx'
import { EthjsAddress } from '@tevm/utils'

/**
 * @param {import('@tevm/base-client').BaseClient} client
 */
export const evmInputToImpersonatedTx = (client) => {
	/**
	 * @param {import('@tevm/evm').EvmRunCallOpts} evmInput
	 */
	return async (evmInput) => {
		const vm = await client.getVm()

		const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
		const priorityFee = 0n

		const sender = evmInput.origin ?? evmInput.caller ?? EthjsAddress.fromString(`0x${'00'.repeat(20)}`)

		const txPool = await client.getTxPool()
		const txs = await txPool.getBySenderAddress(sender)

		const nonce = ((await vm.stateManager.getAccount(sender)) ?? { nonce: 0n }).nonce + BigInt(txs.length)

		client.logger.debug({ nonce, sender: sender.toString() }, 'creating tx with nonce')

		// TODO we should be allowing actual real signed tx too here
		// TODO known bug here we should be allowing unlimited code size here based on user providing option
		// Just lazily not looking up how to get it from client.getVm().evm yet
		// Possible we need to make property public on client
		return createImpersonatedTx(
			{
				impersonatedAddress: sender,
				nonce,
				maxFeePerGas: parentBlock.header.calcNextBaseFee() + priorityFee,
				maxPriorityFeePerGas: 0n,
				...(evmInput.to !== undefined ? { to: evmInput.to } : {}),
				...(evmInput.data !== undefined ? { data: evmInput.data } : {}),
				...(evmInput.value !== undefined ? { value: evmInput.value } : {}),
				gasPrice: null,
			},
			{
				allowUnlimitedInitCodeSize: false,
				common: vm.common.ethjsCommon,
				// we don't want to freeze because there is a hack to set tx.hash when building a block
				freeze: false,
			},
		)
	}
}
