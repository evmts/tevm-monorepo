import { createMemoryClient, http } from 'tevm'

const memoryClient = await createMemoryClient({
	fork: {
		transport: http('https://bartio.rpc.berachain.com/')({}),
	},
})

const txData = {
	data: '0xd0e30db0',
	to: '0x7507c1dc16935B82698e4C63f2746A2fCf994dF8',
	from: '0x2a440A6B506bC8e70343497505829caF27Ab255f',
	value: '100000000000000',
} as const

const callResult = await memoryClient.tevmCall({
	from: txData.from,
	to: txData.to,
	...(txData.data !== null ? { data: txData.data } : {}),
	value: BigInt('100000000000000'),
	createTransaction: 'on-success',
})

console.log(callResult)
