import { mainnet } from 'viem/chains'
import { z } from 'zod'

export const rpcUrls = {
	1: z
		.string()
		.url()
		.optional()
		.default(mainnet.rpcUrls.default.http[0])
		.parse(process.env.RPC_URL_MAINNET),
}
