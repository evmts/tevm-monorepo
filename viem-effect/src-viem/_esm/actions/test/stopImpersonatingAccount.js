/**
 * Stop impersonating an account after having previously used [`impersonateAccount`](https://viem.sh/docs/actions/test/impersonateAccount.html).
 *
 * - Docs: https://viem.sh/docs/actions/test/stopImpersonatingAccount.html
 *
 * @param client - Client to use
 * @param parameters – {@link StopImpersonatingAccountParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { stopImpersonatingAccount } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await stopImpersonatingAccount(client, {
 *   address: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
 * })
 */
export async function stopImpersonatingAccount(client, { address }) {
    await client.request({
        method: `${client.mode}_stopImpersonatingAccount`,
        params: [address],
    });
}
//# sourceMappingURL=stopImpersonatingAccount.js.map