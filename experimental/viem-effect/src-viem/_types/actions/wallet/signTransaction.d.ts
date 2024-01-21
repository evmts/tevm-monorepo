import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { GetAccountParameter } from '../../types/account.js'
import type { Chain, GetChain } from '../../types/chain.js'
import type { TransactionSerialized } from '../../types/transaction.js'
import type { UnionOmit } from '../../types/utils.js'
import { type FormattedTransactionRequest } from '../../utils/formatters/transactionRequest.js'
export type SignTransactionParameters<
	TChain extends Chain | undefined = Chain | undefined,
	TAccount extends Account | undefined = Account | undefined,
	TChainOverride extends Chain | undefined = Chain | undefined,
> = UnionOmit<
	FormattedTransactionRequest<
		TChainOverride extends Chain ? TChainOverride : TChain
	>,
	'from'
> &
	GetAccountParameter<TAccount> &
	GetChain<TChain, TChainOverride>
export type SignTransactionReturnType = TransactionSerialized
/**
 * Signs a transaction.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/signTransaction.html
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`eth_signTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
 *   - Local Accounts: Signs locally. No JSON-RPC request.
 *
 * @param args - {@link SignTransactionParameters}
 * @returns The signed serialized tranasction. {@link SignTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { signTransaction } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signTransaction(client, {
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
 * import { signTransaction } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signTransaction(client, {
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 */
export declare function signTransaction<
	TChain extends Chain | undefined,
	TAccount extends Account | undefined,
	TChainOverride extends Chain | undefined,
>(
	client: Client<Transport, TChain, TAccount>,
	args: SignTransactionParameters<TChain, TAccount, TChainOverride>,
): Promise<SignTransactionReturnType>
//# sourceMappingURL=signTransaction.d.ts.map
