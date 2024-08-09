import { type Address, createTevmNode, encodeDeployData, tevmTransport } from 'tevm'
import { optimism } from 'tevm/common'
import { requestEip1193 } from 'tevm/decorators'
import { createConfig } from 'wagmi'

export const client = createTevmNode({ common: optimism }).extend(requestEip1193())

export const wagmiConfig = createConfig({
	chains: [optimism],
	connectors: [],
	ssr: true,
	cacheTime: 0,
	transports: {
		[optimism.id]: tevmTransport(client),
	},
})

import { privateKeyToAccount } from 'viem/accounts'
import { getTransactionReceipt, readContract, sendTransaction } from 'wagmi/actions'
import { Fibonacci } from './fib.s.sol.js'

// anvil[0] test account
const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
const hash = await sendTransaction(wagmiConfig, {
	account,
	data: encodeDeployData(Fibonacci),
	// This is a type bug in wagmi
	// https://github.com/wevm/wagmi/pull/4009
	to: undefined as any,
})

const receipt = await getTransactionReceipt(wagmiConfig, { hash })

console.log(
	await readContract(wagmiConfig, Fibonacci.withAddress(receipt.contractAddress as Address).read.calculate(10n)),
)
