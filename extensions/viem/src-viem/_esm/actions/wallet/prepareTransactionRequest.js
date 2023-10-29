import { parseAccount } from '../../accounts/utils/parseAccount.js'
import { internal_estimateFeesPerGas } from '../../actions/public/estimateFeesPerGas.js'
import { estimateGas } from '../../actions/public/estimateGas.js'
import { getBlock } from '../../actions/public/getBlock.js'
import { getTransactionCount } from '../../actions/public/getTransactionCount.js'
import { AccountNotFoundError } from '../../errors/account.js'
import {
	Eip1559FeesNotSupportedError,
	MaxFeePerGasTooLowError,
} from '../../errors/fee.js'
import { assertRequest } from '../../utils/transaction/assertRequest.js'
import { getTransactionType } from '../../utils/transaction/getTransactionType.js'
/**
 * Prepares a transaction request for signing.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest.html
 *
 * @param args - {@link PrepareTransactionRequestParameters}
 * @returns The transaction request. {@link PrepareTransactionRequestReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { prepareTransactionRequest } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const request = await prepareTransactionRequest(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { prepareTransactionRequest } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const request = await prepareTransactionRequest(client, {
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 */
export async function prepareTransactionRequest(client, args) {
	const { account: account_ = client.account, chain, gas, nonce, type } = args
	if (!account_) throw new AccountNotFoundError()
	const account = parseAccount(account_)
	const block = await getBlock(client, { blockTag: 'latest' })
	const request = { ...args, from: account.address }
	if (typeof nonce === 'undefined')
		request.nonce = await getTransactionCount(client, {
			address: account.address,
			blockTag: 'pending',
		})
	if (typeof type === 'undefined') {
		try {
			request.type = getTransactionType(request)
		} catch {
			// infer type from block
			request.type =
				typeof block.baseFeePerGas === 'bigint' ? 'eip1559' : 'legacy'
		}
	}
	if (request.type === 'eip1559') {
		// EIP-1559 fees
		const { maxFeePerGas, maxPriorityFeePerGas } =
			await internal_estimateFeesPerGas(client, {
				block,
				chain,
				request: request,
			})
		if (
			typeof args.maxPriorityFeePerGas === 'undefined' &&
			args.maxFeePerGas &&
			args.maxFeePerGas < maxPriorityFeePerGas
		)
			throw new MaxFeePerGasTooLowError({
				maxPriorityFeePerGas,
			})
		request.maxPriorityFeePerGas = maxPriorityFeePerGas
		request.maxFeePerGas = maxFeePerGas
	} else {
		// Legacy fees
		if (
			typeof args.maxFeePerGas !== 'undefined' ||
			typeof args.maxPriorityFeePerGas !== 'undefined'
		)
			throw new Eip1559FeesNotSupportedError()
		const { gasPrice: gasPrice_ } = await internal_estimateFeesPerGas(client, {
			block,
			chain,
			request: request,
			type: 'legacy',
		})
		request.gasPrice = gasPrice_
	}
	if (typeof gas === 'undefined')
		request.gas = await estimateGas(client, {
			...request,
			account: { address: account.address, type: 'json-rpc' },
		})
	assertRequest(request)
	return request
}
//# sourceMappingURL=prepareTransactionRequest.js.map
