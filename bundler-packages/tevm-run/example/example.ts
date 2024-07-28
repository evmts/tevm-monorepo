// TODO a hard to debug error was thrown if this is not .s.sol. Fix that
import { SimpleContract } from './SimpleContract.s.sol'
// this is purposefully not installed to test we do install!
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

const { createdAddress } = await client.tevmDeploy(SimpleContract.deploy(20n))

const contract = SimpleContract.withAddress(createdAddress)

await client.tevmMine()

const value = await client.readContract(contract.read.get())

if (value !== 20n) {
	console.error(value)
	throw new Error('value should be 20')
}
console.log(value, 'success')
