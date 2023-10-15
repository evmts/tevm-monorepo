/**
 * Sets the coinbase address to be used in new blocks.
 *
 * - Docs: https://viem.sh/docs/actions/test/setCoinbase.html
 *
 * @param client - Client to use
 * @param parameters – {@link SetCoinbaseParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setCoinbase } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setCoinbase(client, {
 *   address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79',
 * })
 */
export async function setCoinbase(client, { address }) {
    await client.request({
        method: `${client.mode}_setCoinbase`,
        params: [address],
    });
}
//# sourceMappingURL=setCoinbase.js.map