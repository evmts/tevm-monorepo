import { WagmiMintExample } from '../../contracts/WagmiMintExample.sol'
import { addresses } from '../addresses'
import styles from './content.module.css'
import * as chains from 'viem/chains'
import {
	Address,
	useAccount,
	useChainId,
	useContractRead,
	useContractWrite,
	useWaitForTransaction,
} from 'wagmi'

function getRandomInt(min = 1, max = 1_000_000_000) {
	const range = max - min + 1
	return Math.floor(Math.random() * range) + min
}

function EtherscanLink({ hash, chainId }: { hash: string; chainId: number }) {
	const chain = [chains.optimism, chains.mainnet, chains.optimismGoerli].find(
		(c) => c.id === chainId,
	)
	return `${chain?.blockExplorers.etherscan.url}/tx/${hash}`
}

export default function WagmiWrites() {
	const getEtherscanLink = () => {}

	const { address, isConnected } = useAccount()
	const chainId = useChainId()

	const { data, refetch } = useContractRead({
		/**
		 * Spreading in a method will spread abi, address and args
		 * Hover over balanceOf and click go-to-definition should take you to the method definition in solidity if compiling from solidity
		 */
		...WagmiMintExample.read().balanceOf(address as Address),
		enabled: isConnected,
	})

	const {
		error,
		writeAsync: writeMint,
		data: mintData,
		isLoading,
		isSuccess,
	} = useContractWrite({
		address: addresses[chainId as 420],
		/**
		 * Not calling the function will return abi and address without args
		 * This is useful for when you want to lazily call the function like in case of useContractWrite
		 */
		...WagmiMintExample.write().mint,
	})

	useWaitForTransaction({
		hash: mintData?.hash,
		onSuccess: (receipt) => {
			console.log('minted', receipt)
			refetch()
		},
	})

	return (
		<div className={styles.container}>
			<div className={styles.infoItem}>
				<div className={styles.columnContainer}>
					<div className={styles.methodName}>balance:</div>
					<div className={styles.methodValue}>{data?.toString()}</div>
				</div>
			</div>
			<div>
				<div className={styles.infoItem}>
					<div className={styles.columnContainer}>
						<div className={styles.methodName}>Mint status</div>
						<div className={styles.methodValue}>
							{isLoading
								? 'loading...'
								: isSuccess
								? 'successful!'
								: error
								? 'error'
								: 'idle'}
						</div>
					</div>
				</div>
				{mintData?.hash && (
					<div className={styles.infoItem}>
						<div className={styles.columnContainer}>
							<div className={styles.methodName}>Tx link</div>
							<div className={styles.methodValue}>
								<EtherscanLink chainId={chainId} hash={mintData.hash} />
							</div>
						</div>
					</div>
				)}
				<button
					type='button'
					className={styles.button}
					onClick={() =>
						writeMint({
							address: addresses[chainId as 420],
							...WagmiMintExample.write.mint(BigInt(getRandomInt())),
						})
					}
				>
					Mint
				</button>
			</div>
		</div>
	)
}
