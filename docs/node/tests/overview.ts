import { createMemoryClient, PREFUNDED_ACCOUNTS } from 'tevm'
import { SimpleContract } from 'tevm/contract'

const client = createMemoryClient()

const contract = SimpleContract.withAddress(`0x${'40'.repeat(20)}`)

await client.setCode({
	address: contract.address,
	bytecode: contract.deployedBytecode,
})

await client.writeContract({
	account: PREFUNDED_ACCOUNTS[0],
	abi: contract.abi,
	functionName: 'set',
	args: [420n],
	address: contract.address,
})

await client.tevmMine()

const value = await client.readContract({
	abi: contract.abi,
	functionName: 'get',
	address: contract.address,
})

console.log(value)
