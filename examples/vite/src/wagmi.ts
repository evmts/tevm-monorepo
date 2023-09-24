import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { type QueryClient } from '@tanstack/react-query'
import { configureChains, createConfig } from 'wagmi'
import { mainnet, optimismGoerli } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const walletConnectProjectId = '898f836c53a18d0661340823973f0cb4'

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[mainnet, optimismGoerli],
	[
		jsonRpcProvider({
			rpc: (chain) => {
				const urls = {
					1: { http: import.meta.env.VITE_RPC_URL_1 },
					420: { http: import.meta.env.VITE_RPC_URL_420 },
				}
				return [1, 420].includes(chain.id) ? urls[chain.id as 1 | 420] : null
			},
		}),
	],
)

const { connectors } = getDefaultWallets({
	appName: 'My wagmi + RainbowKit App',
	chains,
	projectId: walletConnectProjectId,
})

export const config = (queryClient: QueryClient) =>
	createConfig({
		autoConnect: true,
		connectors,
		publicClient,
		webSocketPublicClient,
		queryClient,
	})

export { chains }
