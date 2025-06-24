import FetchAdapter from '@pollyjs/adapter-fetch'
import NodeHTTPAdapter from '@pollyjs/adapter-node-http'
import { Polly } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import { normalizeJsonRpcRequest } from './normalizeJsonRpcRequest.js'
import { isCachedMethod } from './isCachedMethod.js'

let polly: Polly | null = null

export const createPolly = (snapshotDir: string) => {
	Polly.register(NodeHTTPAdapter as any)
	Polly.register(FetchAdapter as any)
	Polly.register(FSPersister as any)

	return {
		init: () => {
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
					method: true,
					headers: false, // Don't match headers to avoid auth token issues
					// Normalize the request to match by block height
					body: (body: string, req) => normalizeJsonRpcRequest(req.url, body),
					order: false,
					url: {
						hostname: true,
					},
				},
			})

      // Record only specific URLs and cacheable methods, passthrough everything else
			polly.server
      .any()
      .filter(({ url, body }) => !cachedRpcUrls.some(cachedUrl => url.includes(cachedUrl)) || !isCachedMethod(body))
      .passthrough()
		},
		destroy: () => {
			polly?.stop()
			polly = null
		},
	}
}
