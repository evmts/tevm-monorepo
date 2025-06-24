import FetchAdapter from '@pollyjs/adapter-fetch'
import NodeHTTPAdapter from '@pollyjs/adapter-node-http'
import { Polly } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import { type Hex } from 'viem'
import { isCachedMethod } from './internal/isCachedMethod.js'
import { normalizeJsonRpcRequest } from './internal/normalizeJsonRpcRequest.js'

export const createPolly = (snapshotDir: string) => {
	let polly: Polly | null = null

	Polly.register(NodeHTTPAdapter as any)
	Polly.register(FetchAdapter as any)
	Polly.register(FSPersister as any)

	return {
		init: (chainId: Hex) => {
			const cachedRpcUrls = ['https://mainnet.optimism.io'] // TODO: retrieve that dynamically from provided fork urls + default chain url

			polly = new Polly('@tevm/test-node', {
				adapters: ['node-http', 'fetch'],
				persister: 'fs',
				recordIfMissing: true,
				mode: 'replay',
				flushRequestsOnStop: true,
				persisterOptions: {
					fs: {
						recordingsDir: snapshotDir,
					},
				},
				matchRequestsBy: {
					method: false,
					url: false,
					headers: false,
					order: false,
					// Normalize the request to match by block height
					body: (body: string) => normalizeJsonRpcRequest(chainId, body),
				},
			})

			// Record only specific URLs and cacheable methods, passthrough everything else
			polly.server
				.any()
				.filter(({ url, body }) => !cachedRpcUrls.some((cachedUrl) => url.includes(cachedUrl)) || !isCachedMethod(body))
				.passthrough()
		},
		destroy: () => {
			polly?.stop()
			polly = null
		},
	}
}
