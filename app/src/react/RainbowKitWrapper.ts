import { type FC, createElement } from 'react'
import '@rainbow-me/rainbowkit/styles.css'
import { ConnectButton, RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

interface RainbowKitButtonProps {
	config: ReturnType<typeof getDefaultConfig>
	queryClient: QueryClient
}

export const RainbowKitButton: FC<RainbowKitButtonProps> = ({ config, queryClient }) => {
	return createElement(
		WagmiProvider,
		{ config },
		createElement(
			QueryClientProvider,
			{ client: queryClient },
			createElement(RainbowKitProvider, null, createElement(ConnectButton, null)),
		),
	)
}
