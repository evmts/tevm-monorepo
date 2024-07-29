// this is purposefully not installed to test we do install!
import { createMemoryClient } from 'tevm'
// TODO a hard to debug error was thrown if this is not .s.sol. Fix that
import { SimpleContract } from './SimpleContract.s.sol'

const client = createMemoryClient()

const { createdAddress } = await client.tevmDeploy(SimpleContract.deploy(20n))

const contract = SimpleContract.withAddress(createdAddress)

await client.tevmMine()

const value = await client.readContract(contract.read.get())

if (value !== 20n) {
	console.error(value)
	throw new Error('value should be 20')
}
console.log('success')
console.log('address: ', createdAddress)
console.log('SimpleContract.get(): ', value)
