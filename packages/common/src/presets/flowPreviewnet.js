// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { flowPreviewnet as _flowPreviewnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the flowPreviewnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 646
 * Chain Name: FlowEVM Previewnet
 * Default Block Explorer: https://previewnet.flowdiver.io
 * Default RPC URL: https://previewnet.evm.nodes.onflow.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { flowPreviewnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: flowPreviewnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const flowPreviewnet = createCommon({
	..._flowPreviewnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
