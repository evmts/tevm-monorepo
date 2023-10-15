import { parseAccount } from '../../accounts/utils/parseAccount.js';
import { AccountNotFoundError } from '../../errors/account.js';
import {} from '../../types/rpc.js';
import { assertCurrentChain } from '../../utils/chain.js';
import { formatTransactionRequest, } from '../../utils/formatters/transactionRequest.js';
import { numberToHex } from '../../utils/index.js';
import { assertRequest } from '../../utils/transaction/assertRequest.js';
import { getChainId } from '../public/getChainId.js';
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
export async function signTransaction(client, args) {
    const { account: account_ = client.account, chain = client.chain, ...transaction } = args;
    if (!account_)
        throw new AccountNotFoundError({
            docsPath: '/docs/actions/wallet/signTransaction',
        });
    const account = parseAccount(account_);
    assertRequest({
        account,
        ...args,
    });
    const chainId = await getChainId(client);
    if (chain !== null)
        assertCurrentChain({
            currentChainId: chainId,
            chain,
        });
    const formatters = chain?.formatters || client.chain?.formatters;
    const format = formatters?.transactionRequest?.format || formatTransactionRequest;
    if (account.type === 'local')
        return account.signTransaction({
            chainId,
            ...transaction,
        }, { serializer: client.chain?.serializers?.transaction });
    return await client.request({
        method: 'eth_signTransaction',
        params: [
            {
                ...format(transaction),
                chainId: numberToHex(chainId),
                from: account.address,
            },
        ],
    });
}
//# sourceMappingURL=signTransaction.js.map