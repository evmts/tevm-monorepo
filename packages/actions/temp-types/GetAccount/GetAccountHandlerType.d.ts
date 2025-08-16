import type { GetAccountParams } from './GetAccountParams.js';
import type { GetAccountResult } from './GetAccountResult.js';
/**
 * Gets the state of a specific Ethereum address.
 * This handler is for use with a low-level TEVM `TevmNode`, unlike `tevmGetAccount`.
 * @example
 * ```typescript
 * import { createClient } from 'tevm'
 * import { getAccountHandler } from 'tevm/actions'
 *
 * const client = createClient()
 * const getAccount = getAccountHandler(client)
 *
 * const res = await getAccount({ address: '0x123...' })
 * console.log(res.deployedBytecode)
 * console.log(res.nonce)
 * console.log(res.balance)
 * ```
 */
export type GetAccountHandler = (params: GetAccountParams) => Promise<GetAccountResult>;
//# sourceMappingURL=GetAccountHandlerType.d.ts.map