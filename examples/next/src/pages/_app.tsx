import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'

import { chains, config } from '../wagmi'

function App({ Component, pageProps }: AppProps) {
	const [mounted, setMounted] = React.useState(false)
	React.useEffect(() => setMounted(true), [])
	return (
		<WagmiConfig config={config}>
			<RainbowKitProvider chains={chains}>
				<NextHead>
					<title>My wagmi + RainbowKit App</title>
				</NextHead>

				{mounted && <Component {...pageProps} />}
			</RainbowKitProvider>
		</WagmiConfig>
	)
}

export default App
