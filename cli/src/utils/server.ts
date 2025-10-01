import { Server } from 'node:http'
import {
	anvil,
	arbitrum,
	arbitrumSepolia,
	avalanche,
	base,
	blast,
	bsc,
	gnosis,
	mainnet,
	moonbeam,
	optimism,
	optimismGoerli,
	optimismSepolia,
	polygon,
	scroll,
	sepolia,
	tevmDefault,
	zksync,
} from '@tevm/common'
import { http } from '@tevm/jsonrpc'
import { createMemoryClient, MemoryClient } from '@tevm/memory-client'
import { createServer } from '@tevm/server'
import { createLoggingRequestProxy } from '../stores/logStore.js'

export async function initializeServer({
	port,
	host,
	chainId,
	verbose,
	fork,
}: {
	port: number
	host: string
	chainId: string
	fork?: string
	forkBlockNumber: string
	loggingLevel: string
	verbose: boolean
}): Promise<{ client: MemoryClient; server: Server }> {
	const chains: Record<number, any> = {
		[base.id]: base,
		[mainnet.id]: mainnet,
		[optimism.id]: optimism,
		[tevmDefault.id]: tevmDefault,
		[optimismSepolia.id]: optimismSepolia,
		[optimismGoerli.id]: optimismGoerli,
		[sepolia.id]: sepolia,
		[arbitrum.id]: arbitrum,
		[arbitrumSepolia.id]: arbitrumSepolia,
		[avalanche.id]: avalanche,
		[bsc.id]: bsc,
		[polygon.id]: polygon,
		[zksync.id]: zksync,
		[gnosis.id]: gnosis,
		[moonbeam.id]: moonbeam,
		[anvil.id]: anvil,
		[blast.id]: blast,
		[scroll.id]: scroll,
	}

	const chain = chains[parseInt(chainId, 10)]

	if (!chain) {
		throw new Error(
			`Unknown chain id: ${chainId}. Valid chain ids are ${Object.entries(chains)
				.map(([id, chain]) => `${id} (${chain.name})`)
				.join(', ')}`,
		)
	}

	const client = createMemoryClient({
		...(fork?.length ? { fork: { transport: http(fork) } } : {}),
	})

	// Add request logging if verbose mode is enabled
	if (verbose) {
		// Create a proxy around the request function
		const originalRequest = client.request
		client.request = createLoggingRequestProxy(originalRequest, verbose)
	}

	// Create and start the server
	const server = createServer(client)

	// Handle graceful shutdown
	const handleShutdown = () => {
		server.close()
		process.exit(0)
	}

	process.on('SIGINT', handleShutdown)
	process.on('SIGTERM', handleShutdown)

	await new Promise<void>((resolve) => {
		server.listen(port, host, () => {
			resolve()
		})
	})

	// Return the client and server for use by action components
	return { client, server }
}
