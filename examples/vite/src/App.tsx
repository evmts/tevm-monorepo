import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

import { EthersExample } from './EthersExample'
import { WagmiEvents } from './wagmi/WagmiEvents'
import { WagmiReads } from './wagmi/WagmiReads'
import { WagmiWrites } from './wagmi/WagmiWrites'
import { useState } from 'react'

export function App() {
	const [selectedComponent, selectComponent] =
		useState<keyof typeof components>('unselected')

	const { isConnected } = useAccount()

	const components = {
		unselected: <>Select which component to render</>,
		reads: <WagmiReads />,
		writes: <WagmiWrites />,
		events: <WagmiEvents />,
		ethers: <EthersExample />,
	} as const

	return (
		<>
			<h1>Evmts example</h1>
			<ConnectButton />
			{isConnected && (
				<>
					<hr />
					<div style={{ display: 'flex' }}>
						{Object.keys(components).map((component) => {
							return (
								<button
									type='button'
									onClick={() =>
										selectComponent(component as keyof typeof components)
									}
								>
									{component}
								</button>
							)
						})}
					</div>
					<h2>{selectedComponent}</h2>
					{components[selectedComponent]}
				</>
			)}
		</>
	)
}
