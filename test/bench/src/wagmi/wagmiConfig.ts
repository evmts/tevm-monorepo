import { createMemoryClient, encodeDeployData, tevmTransport, type Address } from 'tevm'
import { optimism } from 'tevm/common'
import { createConfig } from 'wagmi'

export const memoryClient = createMemoryClient({ common: optimism })

export const wagmiConfig = createConfig({
	chains: [optimism],
	connectors: [],
	ssr: true,
	cacheTime: 0,
	transports: {
		[optimism.id]: tevmTransport(memoryClient),
	},
})

import { Fibonacci } from './fib.s.sol.js'
import { privateKeyToAccount } from 'viem/accounts'
import { getTransactionReceipt, sendTransaction, readContract } from 'wagmi/actions'

// anvil[0] test account
const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
const hash = await sendTransaction(wagmiConfig, {
	account,
	data: encodeDeployData(Fibonacci),
	// This is a type bug in wagmi
	// https://github.com/wevm/wagmi/pull/4009
	to: undefined as any,
})

const { blockHashes } = await memoryClient.tevmMine()

const receipt = await getTransactionReceipt(wagmiConfig, { hash })

console.log(
	await readContract(wagmiConfig, Fibonacci.withAddress(receipt.contractAddress as Address).read.calculate(10n)),
)
