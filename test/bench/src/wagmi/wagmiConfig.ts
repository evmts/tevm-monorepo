import { createMemoryClient, tevmTransport } from 'tevm'
import { createCommon, tevmDefault } from 'tevm/common'
import { hardhat } from 'viem/chains'
import { createConfig } from 'wagmi'
import { mock } from 'wagmi/connectors'

const common = createCommon({
	...tevmDefault,
	id: hardhat.id,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})

export const memoryClient = createMemoryClient({ common })

export const wagmiConfig = createConfig({
	chains: [hardhat],
	connectors: [],
	ssr: true,
	cacheTime: 0,
	transports: {
		[hardhat.id]: tevmTransport(memoryClient) as any,
	},
})
