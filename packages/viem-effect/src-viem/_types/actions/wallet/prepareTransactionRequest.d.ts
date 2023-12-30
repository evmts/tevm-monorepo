import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { GetAccountParameter } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { GetChain } from '../../types/chain.js'
import type { UnionOmit } from '../../types/utils.js'
import type { FormattedTransactionRequest } from '../../utils/formatters/transactionRequest.js'
export type PrepareTransactionRequestParameters<
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
export type PrepareTransactionRequestReturnType<
	TChain extends Chain | undefined = Chain | undefined,
	TAccount extends Account | undefined = Account | undefined,
	TChainOverride extends Chain | undefined = Chain | undefined,
> = FormattedTransactionRequest<
	TChainOverride extends Chain ? TChainOverride : TChain
> &
	GetAccountParameter<TAccount> &
	GetChain<TChain, TChainOverride>
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
export declare function prepareTransactionRequest<
	TChain extends Chain | undefined,
	TAccount extends Account | undefined,
	TChainOverride extends Chain | undefined,
>(
	client: Client<Transport, TChain, TAccount>,
	args: PrepareTransactionRequestParameters<TChain, TAccount, TChainOverride>,
): Promise<
	PrepareTransactionRequestReturnType<TChain, TAccount, TChainOverride>
>
//# sourceMappingURL=prepareTransactionRequest.d.ts.map
