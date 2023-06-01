// @ts-nocheck

import { MyERC20 } from './MyERC20.sol'
import { useContractRead, useContractWrite } from '@evmts/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useAccount } from 'wagmi'

export function App() {
	const { isConnected, address } = useAccount()
	const [sendAddress, setSendAddress] = useState('0x4200000000000000000000000000000000000042')
	const [sendAmount, setSendAmount] = useState(BigInt(0))

	const { data: tokenBalance } = useContractRead(
		MyERC20.balanceOf(address),
		{
			enabled: isConnected,
		}
	)

	const { writeAsync: transfer } = useContractWrite(MyERC20.transfer)

	const send = () => {
		transfer({ args: [address, sendAddress, sendAmount] })
	}

	return (
		<>
			<h1>wagmi + RainbowKit + Vite</h1>

			<ConnectButton />

			{isConnected && (
				<div style={{ display: 'flex' }}>
					<h2>Connected to {address}</h2>
					<h3>Balance: {tokenBalance.toString()}</h3>
					<div>
						Send to: <input type="text" placeholder="Address" value={sendAddress} onChange={e => {
							setSendAddress(e.target.value)
						}} />
					</div>
					<div>
						Amount to send: <input value={sendAmount.toString()} onChange={e => { setSendAmount(BigInt(e.target.value)) }} type="number" placeholder="Address" />
					</div>
					<button type="button" onClick={() => send()}>Send tokens</button>
				</div>
			)}
		</>
	)
}

