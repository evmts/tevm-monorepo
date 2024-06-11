import { z } from 'zod'
import { zBlockParam } from '../params/zBlockParam.js'

export const zNetworkConfig = z
	.object({
		url: z.string().url().describe('The URL of the network to connect to'),
		blockTag: zBlockParam.optional().describe('The block tag to use for the connection. Uses latest if not specified'),
	})
	.describe('The configuration for a network connection to another JSON-RPC provider')
