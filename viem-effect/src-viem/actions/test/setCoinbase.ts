import type { Address } from 'abitype'

import type {
  TestClient,
  TestClientMode,
} from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'

export type SetCoinbaseParameters = {
  /** The coinbase address. */
  address: Address
}

export type SetCoinbaseErrorType = RequestErrorType | ErrorType

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
export async function setCoinbase<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: TestClient<TestClientMode, Transport, TChain, TAccount, false>,
  { address }: SetCoinbaseParameters,
) {
  await client.request({
    method: `${client.mode}_setCoinbase`,
    params: [address],
  })
}
