import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useContractRead } from 'wagmi'
import { ExampleContract } from './ExampleContract.sol'

export function App() {
	const { isConnected } = useAccount()

	useContractRead({
		abi: ExampleContract
	})

	return (
		<>
			<h1>wagmi + RainbowKit + Vite</h1>

			<ConnectButton />

			{isConnected && (
				<>
				</>
			)}
		</>
	)
}

