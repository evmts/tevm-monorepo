import type { EthSimulateV2Params } from './EthSimulateV2Params.js'
import type { EthSimulateV2Result } from './EthSimulateV2Result.js'

/**
 * Handler for eth_simulateV2 JSON-RPC method
 * Simulates multiple transaction calls with comprehensive state overrides and tracing support
 */
export type EthSimulateV2Handler = (request: EthSimulateV2Params) => Promise<EthSimulateV2Result>