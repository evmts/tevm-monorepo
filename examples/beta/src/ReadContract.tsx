import { WagmiMintExample } from './contracts/WagmiMintExample.sol'
import { useAccount, useContractRead } from 'wagmi'

export const ReadContract = () => {
	const { address, isConnected } = useAccount()

	const { data } = useContractRead({
		...WagmiMintExample.read.balanceOf(address!),
		enabled: isConnected,
	})
	return (
		<div>
			<div>balance: {data?.toString()}</div>
		</div>
	)
}
