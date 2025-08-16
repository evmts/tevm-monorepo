import type { MineParams } from './MineParams.js';
import type { MineResult } from './MineResult.js';
/**
 * Mines a block including all transactions in the mempool.
 *
 * @example
 * ```typescript
 * const res = await tevmClient.mine({ blocks: 2, interval: 2 })
 * console.log(res.errors) // undefined
 * ```
 *
 * @param {MineParams} [params] - The parameters for the mine action.
 * @returns {Promise<MineResult>} - The result of the mine action.
 *
 * @see {@link MineParams} for details on the parameters.
 * @see {@link MineResult} for details on the result.
 */
export type MineHandler = (params?: MineParams) => Promise<MineResult>;
//# sourceMappingURL=MineHandlerType.d.ts.map