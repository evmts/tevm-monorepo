import { addresses } from './addresses'
import { WagmiMintExample } from './contracts/WagmiMintExample.sol'
import { Contract } from '@evmts/ethers'
import { useQuery } from '@tanstack/react-query'
import { JsonRpcProvider } from 'ethers'

const getBalance = async () => {
	const provider = new JsonRpcProvider('https://goerli.optimism.io', 420)

	const c = new Contract(addresses[420], WagmiMintExample.abi, provider)

	return c.balanceOf(addresses[420])
}

export const EthersExample = () => {
	const { error, isLoading, data } = useQuery(
		['ethers.Contract().balanceOf'],
		getBalance,
	)

	if (isLoading) {
		return <div>'loading balance...'</div>
	}

	if (error) {
		console.error(error)
		return <div>error loading balance</div>
	}
	return <div>{data?.toString()}</div>
}
