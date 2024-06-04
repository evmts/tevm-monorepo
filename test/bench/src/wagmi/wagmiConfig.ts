import { createMemoryClient, tevmTransport } from 'tevm'
import { createCommon, tevmDefault } from 'tevm/common'
import { hardhat } from 'viem/chains'
import { createConfig } from 'wagmi'
import { mock } from 'wagmi/connectors'

// TODO fix this type by making viem a peer dep
const common = createCommon({
	...tevmDefault,
	id: hardhat.id,
} as any)

export const memoryClient = createMemoryClient({ common })

export const wagmiConfig = createConfig({
	chains: [hardhat],
	connectors: [mock({ accounts: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'] })],
	ssr: true,
	transports: {
		[hardhat.id]: tevmTransport(memoryClient) as any,
	},
})
