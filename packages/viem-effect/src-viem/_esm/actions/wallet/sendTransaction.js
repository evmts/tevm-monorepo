import { parseAccount } from '../../accounts/utils/parseAccount.js'
import { AccountNotFoundError } from '../../errors/account.js'
import { assertCurrentChain } from '../../utils/chain.js'
import { getTransactionError } from '../../utils/errors/getTransactionError.js'
import { extract } from '../../utils/formatters/extract.js'
import { formatTransactionRequest } from '../../utils/formatters/transactionRequest.js'
import { assertRequest } from '../../utils/transaction/assertRequest.js'
import { getChainId } from '../public/getChainId.js'
import { prepareTransactionRequest } from './prepareTransactionRequest.js'
import { sendRawTransaction } from './sendRawTransaction.js'
/**
 * Creates, signs, and sends a new transaction to the network.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/sendTransaction.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/transactions/sending-transactions
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
 *   - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)
 *
 * @param client - Client to use
 * @param parameters - {@link SendTransactionParameters}
 * @returns The [Transaction](https://viem.sh/docs/glossary/terms.html#transaction) hash. {@link SendTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const hash = await sendTransaction(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { sendTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const hash = await sendTransaction(client, {
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 */
export async function sendTransaction(client, args) {
	const {
		account: account_ = client.account,
		chain = client.chain,
		accessList,
		data,
		gas,
		gasPrice,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		to,
		value,
		...rest
	} = args
	if (!account_)
		throw new AccountNotFoundError({
			docsPath: '/docs/actions/wallet/sendTransaction',
		})
	const account = parseAccount(account_)
	try {
		assertRequest(args)
		let chainId
		if (chain !== null) {
			chainId = await getChainId(client)
			assertCurrentChain({
				currentChainId: chainId,
				chain,
			})
		}
		if (account.type === 'local') {
			// Prepare the request for signing (assign appropriate fees, etc.)
			const request = await prepareTransactionRequest(client, {
				account,
				accessList,
				chain,
				data,
				gas,
				gasPrice,
				maxFeePerGas,
				maxPriorityFeePerGas,
				nonce,
				to,
				value,
				...rest,
			})
			if (!chainId) chainId = await getChainId(client)
			const serializer = chain?.serializers?.transaction
			const serializedTransaction = await account.signTransaction(
				{
					...request,
					chainId,
				},
				{ serializer },
			)
			return await sendRawTransaction(client, {
				serializedTransaction,
			})
		}
		const format =
			chain?.formatters?.transactionRequest?.format || formatTransactionRequest
		const request = format({
			// Pick out extra data that might exist on the chain's transaction request type.
			...extract(rest, { format }),
			accessList,
			data,
			from: account.address,
			gas,
			gasPrice,
			maxFeePerGas,
			maxPriorityFeePerGas,
			nonce,
			to,
			value,
		})
		return await client.request({
			method: 'eth_sendTransaction',
			params: [request],
		})
	} catch (err) {
		throw getTransactionError(err, {
			...args,
			account,
			chain: args.chain || undefined,
		})
	}
}
//# sourceMappingURL=sendTransaction.js.map
