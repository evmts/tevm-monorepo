/**
 * @module simulateCalls
 */

/**
 * Simulates a series of calls at a specific block height with optional state overrides.
 * This method allows you to test transactions with custom block and state parameters
 * without actually submitting them to the network.
 *
 * @param {import('viem').Client} client - The client to use.
 * @param {object} params - The parameters for the simulation.
 * @param {`0x${string}`} [params.account] - The address to use as the default sender.
 * @param {Array<{
 *   to?: `0x${string}`,
 *   from?: `0x${string}`,
 *   data?: `0x${string}`,
 *   value?: bigint,
 *   gas?: bigint,
 *   gasPrice?: bigint,
 *   maxFeePerGas?: bigint,
 *   maxPriorityFeePerGas?: bigint,
 *   nonce?: number,
 *   accessList?: Array<{address: `0x${string}`, storageKeys: `0x${string}`[]}>,
 *   abi?: any,
 *   functionName?: string,
 *   args?: any[]
 * }>} params.calls - The calls to simulate.
 * @param {boolean} [params.traceAssetChanges] - Whether to trace asset changes (requires account to be set).
 * @param {Array<{
 *   address: `0x${string}`,
 *   balance?: bigint,
 *   nonce?: number,
 *   code?: `0x${string}`,
 *   storage?: Record<`0x${string}`, `0x${string}`>
 * }>} [params.stateOverrides] - State overrides to apply before simulation.
 * @param {{
 *   baseFeePerGas?: bigint,
 *   timestamp?: bigint,
 *   number?: bigint,
 *   difficulty?: bigint,
 *   gasLimit?: bigint,
 *   coinbase?: `0x${string}`
 * }} [params.blockOverrides] - Block overrides to apply.
 * @param {bigint | 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized' | `0x${string}`} [params.blockNumber] - The block number to simulate at.
 * 
 * @returns {Promise<{
 *   results: Array<{
 *     status: 'success' | 'failure',
 *     data: `0x${string}`,
 *     gasUsed: bigint,
 *     logs: Array<{
 *       address: `0x${string}`,
 *       topics: `0x${string}`[],
 *       data: `0x${string}`
 *     }>,
 *     result?: any,
 *     error?: Error
 *   }>,
 *   assetChanges?: Array<{
 *     token: {
 *       address: `0x${string}`,
 *       symbol: string,
 *       decimals: number
 *     },
 *     value: {
 *       diff: bigint,
 *       start?: bigint,
 *       end?: bigint
 *     }
 *   }>
 * }>} The simulation results and asset changes if requested.
 * 
 * @example
 * ```typescript
 * const { results } = await client.simulateCalls({
 *   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
 *   calls: [
 *     // Call to get a value
 *     {
 *       to: contractAddress,
 *       data: '0x6d4ce63c', // get()
 *     },
 *     // Call to set a value
 *     {
 *       to: contractAddress,
 *       data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000042', // set(66)
 *     }
 *   ],
 *   traceAssetChanges: true
 * })
 * ```
 */
export const simulateCalls = async (client, params) => {
  const response = await client.request({
    method: 'eth_simulateV1',
    params: [
      {
        account: params.account,
        blockStateCalls: params.calls.map(call => ({
          from: call.from || params.account,
          to: call.to,
          data: call.data,
          value: call.value !== undefined ? `0x${call.value.toString(16)}` : undefined,
          gas: call.gas !== undefined ? `0x${call.gas.toString(16)}` : undefined,
          gasPrice: call.gasPrice !== undefined ? `0x${call.gasPrice.toString(16)}` : undefined,
          maxFeePerGas: call.maxFeePerGas !== undefined ? `0x${call.maxFeePerGas.toString(16)}` : undefined,
          maxPriorityFeePerGas: call.maxPriorityFeePerGas !== undefined 
            ? `0x${call.maxPriorityFeePerGas.toString(16)}` 
            : undefined,
          nonce: call.nonce !== undefined ? `0x${call.nonce.toString(16)}` : undefined,
          accessList: call.accessList,
        })),
        blockNumber: params.blockNumber,
        stateOverrides: params.stateOverrides?.map(override => ({
          address: override.address,
          balance: override.balance !== undefined ? `0x${override.balance.toString(16)}` : undefined,
          nonce: override.nonce !== undefined ? `0x${override.nonce.toString(16)}` : undefined,
          code: override.code,
          storage: override.storage,
        })),
        blockOverrides: params.blockOverrides ? {
          baseFeePerGas: params.blockOverrides.baseFeePerGas !== undefined 
            ? `0x${params.blockOverrides.baseFeePerGas.toString(16)}` 
            : undefined,
          timestamp: params.blockOverrides.timestamp !== undefined 
            ? `0x${params.blockOverrides.timestamp.toString(16)}` 
            : undefined,
          number: params.blockOverrides.number !== undefined 
            ? `0x${params.blockOverrides.number.toString(16)}` 
            : undefined,
          difficulty: params.blockOverrides.difficulty !== undefined 
            ? `0x${params.blockOverrides.difficulty.toString(16)}` 
            : undefined,
          gasLimit: params.blockOverrides.gasLimit !== undefined 
            ? `0x${params.blockOverrides.gasLimit.toString(16)}` 
            : undefined,
          coinbase: params.blockOverrides.coinbase,
        } : undefined,
        traceAssetChanges: params.traceAssetChanges,
      }
    ]
  })

  // Convert hex strings back to bigints in the results
  const results = response.results.map(result => ({
    ...result,
    gasUsed: BigInt(result.gasUsed),
  }))

  // Convert hex strings back to bigints in asset changes if present
  let assetChanges
  if (response.assetChanges) {
    assetChanges = response.assetChanges.map(change => ({
      ...change,
      value: {
        diff: BigInt(change.value.diff),
        ...(change.value.start !== undefined ? { start: BigInt(change.value.start) } : {}),
        ...(change.value.end !== undefined ? { end: BigInt(change.value.end) } : {})
      }
    }))
  }

  return {
    results,
    ...(assetChanges ? { assetChanges } : {})
  }
}