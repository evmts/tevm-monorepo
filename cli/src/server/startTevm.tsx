import { chains } from './chains.js'
import { options as optionsSchema } from './options.js'
import { http } from '@tevm/jsonrpc'
import { createMemoryClient, type MemoryClient } from '@tevm/memory-client'
import { createServer } from '@tevm/server'
import { z } from 'zod'
import { type Server } from 'node:http'

export const startTevm = async (options: z.infer<typeof optionsSchema>): Promise<{ transport: MemoryClient, server: Server }> => {
	const chain =
		options.preset !== undefined ? chains[options.preset] : undefined

	const client = createMemoryClient({
		...(chain !== undefined ? { common: chain } : {}),
		fork: {
			// TODO transform it into parsing block tag right with tevm/zod
			blockTag: (options.block as any) ?? 'latest',
			transport: http(options.forkUrl ?? chain?.rpcUrls.default.http[0])({}),
		},
		loggingLevel: options.loggingLevel,
	})

	const server = createServer(client)

	await new Promise<void>((resolve) => {
		server.listen(Number.parseInt(options.port), options.host, resolve)
	})

	return {
		transport: client,
		server,
	}
}
