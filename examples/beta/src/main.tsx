import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { WagmiConfig } from 'wagmi'

import { App } from './App'
import { chains, config } from './wagmi'

const root = document.getElementById('root')

if (!root) {
	throw new Error('No root element found')
}

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<WagmiConfig config={config}>
			<RainbowKitProvider chains={chains}>
				<App />
			</RainbowKitProvider>
		</WagmiConfig>
	</React.StrictMode>,
)
