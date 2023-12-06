import { ConnectButton } from '@rainbow-me/rainbowkit'

import { EthersExample } from './EthersExample'
import { SolEditor } from './SolEditor'
import { WagmiEvents } from './wagmi/WagmiEvents'
import { WagmiReads } from './wagmi/WagmiReads'
import { WagmiWrites } from './wagmi/WagmiWrites'
import { useState } from 'react'

export function App() {
	const [selectedComponent, selectComponent] =
		useState<keyof typeof components>('editor')

	const components = {
		editor: <SolEditor />,
		reads: <WagmiReads />,
		writes: <WagmiWrites />,
		events: <WagmiEvents />,
		ethers: <EthersExample />,
	} as const

	return (
		<>
			<h1>Tevm example</h1>
			<ConnectButton />
			{
				<>
					<hr />
					<div style={{ display: 'flex' }}>
						{Object.keys(components).map((component) => {
							return (
								<button
									key={component}
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
			}
		</>
	)
}
