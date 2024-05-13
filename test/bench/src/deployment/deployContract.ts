import { tevmTransport } from '@tevm/viem'
import { createMemoryClient, encodeDeployData } from 'tevm'
import { createPublicClient, createWalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { anvil } from 'viem/chains'
import { SimpleConstructor } from './SimpleConstructor.s.sol'

// deploys contract with initial value and returns the set value
// after deployed.The set value should match initial.
type ContractDeployment = (initialValue: bigint) => Promise<bigint>

const account0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

/**
 * This way is a little more verbose but works more like a real contract deployment
 * This is instructive but I would likely use viem `deployContract` (next example) over this
 */
export const deployContractWithCall: ContractDeployment = async (initialValue) => {
	const client = createMemoryClient()

	// manually call the constructor function
	const deployResult = await client.tevmCall({
		data: encodeDeployData({
			abi: SimpleConstructor.abi,
			bytecode: SimpleConstructor.bytecode,
			args: [initialValue],
		}),
		createTransaction: true,
		from: account0,
	})

	if (!deployResult.createdAddress) {
		throw new Error('Did not create any addresses')
	}
	// check that correctly set
	const { data } = await client.tevmContract({
		abi: SimpleConstructor.abi,
		functionName: 'get',
		args: [],
		to: deployResult.createdAddress,
	})
	return data
}

/**
 * This last example is the way I am documenting people should use
 * which is to simply use viem `deployContract`
 */
export const deployContractWithViem: ContractDeployment = async (initialValue) => {
	const tevmClient = createMemoryClient()
	const walletClient = createWalletClient({
		// TODO add chain property to tevm instance
		chain: { ...anvil, id: 900 },
		// TODO fix this type not matching because of viem versioning issue
		transport: tevmTransport(tevmClient) as any,
		account: privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'),
	})

	const hash = await walletClient.deployContract({
		abi: SimpleConstructor.abi,
		bytecode: SimpleConstructor.bytecode,
		args: [initialValue],
	})

	const publicClient = createPublicClient({
		// TODO add chain property to tevm instance
		chain: { ...anvil, id: 900 },
		// TODO fix this type not matching because of viem versioning issue
		transport: tevmTransport(tevmClient) as any,
	})

	const receipt = await publicClient.waitForTransactionReceipt({ hash })

	return publicClient.readContract({
		abi: SimpleConstructor.abi,
		functionName: 'get',
		address: receipt.contractAddress,
	})
}
