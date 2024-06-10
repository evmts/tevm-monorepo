import type { MineParams, MineResult } from '../index.js'

/**
 * Mines a block including all transactions in the mempool
 * @example
 * const res = tevmClient.mine({blocks: 2, interval: 2})
 * console.log(res.errors) // undefined
 */
export type MineHandler = (params?: MineParams) => Promise<MineResult>
