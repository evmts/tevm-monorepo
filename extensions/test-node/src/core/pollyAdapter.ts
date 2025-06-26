import FetchAdapter from '@pollyjs/adapter-fetch'
import NodeHTTPAdapter from '@pollyjs/adapter-node-http'
import { Polly, type Request } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import path from 'node:path'
import { type Hex } from 'viem'
import { isCachedMethod } from '../internal/isCachedMethod.js'
import { normalizeJsonRpcRequest } from '../internal/normalizeJsonRpcRequest.js'
import { getCurrentTestFile } from './getCurrentTestFile.js'

// Register adapters once globally
Polly.register(NodeHTTPAdapter as any)
Polly.register(FetchAdapter as any)
Polly.register(FSPersister as any)

/**
 * Single Polly instance per test file (since concurrent node-http adapters are unsupported)
 */
let polly: Polly | null = null

const cleanup = async () => {
	await polly?.stop()
	polly = null
}

/**
 * Simple Polly adapter that manages a single instance per test file
 * Since Polly.js doesn't support concurrent node-http adapters, we keep it simple
 */
export const pollyAdapter = {
	/**
	 * Initialize Polly instance for the current test file
	 */
	init: async (snapshotDir: string, chainId: Hex): Promise<Polly> => {
		// Clean up any existing instance first
		if (polly) {
			await polly.stop()
			polly = null
		}

		const testFile = getCurrentTestFile()
		const recordingsDir = path.join(snapshotDir, testFile)

		polly = new Polly(testFile, {
			adapters: ['node-http', 'fetch'],
			persister: 'fs',
			recordIfMissing: true,
			mode: 'replay',
			flushRequestsOnStop: true,
			persisterOptions: {
				fs: {
					// Store snapshots in a clean directory structure: __snapshots__/testFileName.spec.ts/
					recordingsDir,
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

		// Configure request filtering - only cache specific methods
		const shouldNotCache = ({ body, url }: Request) => url.includes('localhost') || url.includes('127.0.0.1') || !isCachedMethod(body)
		polly.server
			.any()
			.filter(shouldNotCache)
			.passthrough()

		// Redact sensitive information from URLs
		polly.server.any().on('beforePersist', (_, recording) => {
			recording.request.url = recording.request.url.replace(/(\/)[^/?#]*(\?|#|$)/, '$1REDACTED_TOKEN$2')
		})

		// Register cleanup handlers
		if (typeof process !== 'undefined') {
			process.once('exit', cleanup)
			process.once('SIGINT', cleanup)
			process.once('SIGTERM', cleanup)
		}

		return polly
	},

	/**
	 * Force flush recordings without stopping Polly
	 * This allows tests to check snapshots mid-test
	 */
	flush: async (): Promise<void> => {
		if (polly) {
			await polly.flush() // wait for any pending requests to complete
			await polly.persister?.persist()
		}
	},

	/**
	 * Destroy the current Polly instance
	 */
	destroy: async (): Promise<void> => {
		await cleanup()
	}
}