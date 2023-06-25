import { WagmiMintExample } from './contracts/WagmiMintExample.sol'
import { useAccount, useContractRead } from 'wagmi'

export const ReadContract = () => {
	const { address, isConnected } = useAccount()

	const { data, error, isLoading, isSuccess } = useContractRead({
		...WagmiMintExample.read.balanceOf(address),
		enabled: isConnected,
	})
	console.log({
		data,
		error,
		isLoading,
		isSuccess,
		params: WagmiMintExample.read.balanceOf(address),
	})
	return <div>{data?.toString()}</div>
}
