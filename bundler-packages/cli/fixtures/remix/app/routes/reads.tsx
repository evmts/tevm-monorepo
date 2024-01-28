import { WagmiMintExample } from '../../contracts/WagmiMintExample.sol'
import styles from './content.module.css'
import { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Address, createPublicClient, http } from 'viem'
import { optimismGoerli } from 'viem/chains'
import { useAccount, useChainId, useContractRead } from 'wagmi'
import { addresses } from '~/addresses'

/**
 * Load common data for all account serverside
 */
export const loader: LoaderFunction = async () => {
	const client = createPublicClient({
		transport: http('https://goerli.optimism.io'),
		chain: optimismGoerli,
	})

	const address = { address: addresses[optimismGoerli.id] }

	const [tokenUri, symbol, totalSupply] = await Promise.all([
		client.readContract({
			...WagmiMintExample.read().tokenURI(BigInt(1)),
			...address,
		}),
		client.readContract({ ...WagmiMintExample.read().symbol(), ...address }),
		client.readContract({
			...WagmiMintExample.read().totalSupply(),
			...address,
		}),
	])

	return { symbol, tokenUri, totalSupply: totalSupply.toString() }
}

export default function Reads() {
	const { symbol, tokenUri, totalSupply } = useLoaderData<typeof loader>()
	const { address, isConnected } = useAccount()
	const chainId = useChainId()
	const { data: balance } = useContractRead({
		...WagmiMintExample.read().balanceOf(address as Address),
		address: addresses[chainId as 420],
		enabled: isConnected,
	})
	return (
		<div className={styles.container}>
			<div className={styles.infoItem}>
				<div className={styles.columnContainer}>
					<div className={styles.methodName}>
						client balanceOf(<span className={styles.highlight}>{address}</span>
						):
					</div>
					<div className={styles.methodValue}>
						<span className={styles.highlight}>{balance?.toString()}</span>
					</div>
				</div>
			</div>
			<div className={styles.infoItem}>
				<div className={styles.columnContainer}>
					<div className={styles.methodName}>totalSupply():</div>
					<div className={styles.methodValue}>
						<span className={styles.highlight}>{totalSupply?.toString()}</span>
					</div>
				</div>
			</div>
			<div className={styles.infoItem}>
				<div className={styles.columnContainer}>
					<div className={styles.methodName}>tokenUri(BigInt(1)):</div>
					<div className={styles.methodValue}>{tokenUri?.toString()}</div>
				</div>
			</div>
			<div className={styles.infoItem}>
				<div className={styles.columnContainer}>
					<div className={styles.methodName}>symbol():</div>
					<div className={styles.methodValue}>
						<span className={styles.highlight}>{symbol?.toString()}</span>
					</div>
				</div>
			</div>
		</div>
	)
}
