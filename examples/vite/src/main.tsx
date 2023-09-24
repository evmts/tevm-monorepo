import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { WagmiConfig } from 'wagmi'

const queryClient = new QueryClient()

import { App } from './App'
import { chains, config } from './wagmi'

const root = document.getElementById('root')

if (!root) {
	throw new Error('No root element found')
}

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<WagmiConfig config={config(queryClient)}>
				<RainbowKitProvider chains={chains}>
					<App />
				</RainbowKitProvider>
			</WagmiConfig>
		</QueryClientProvider>
	</React.StrictMode>,
)
