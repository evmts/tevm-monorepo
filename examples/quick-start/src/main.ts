import { http, Address, Hex, createMemoryClient } from 'tevm'
import { prefundedAccounts } from 'tevm'
import { optimism } from 'tevm/common'
import { SimpleContract } from 'tevm/contract'
// To get rid of the red underline for this import you must use the local typescript version
// https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript
// > Typescript: Select Typescript version: Use Workspace Version
import { Counter } from '../contracts/Counter.s.sol'

// This counter contract got imported from a solidity file directly into TypeScript
// Logging counter contract to see what properties it has
// If we add natspec comments to the contract they will also show up here
// Hover over it to see it'
console.log(Counter)
console.log('accounts prefunded with 1000 eth', prefundedAccounts)

const app = document.querySelector('#app') as Element

// The memoryclient is an in memory evm devnet that runs in the browser, node.js, and bun
// It's main api is the viem api
const memoryClient = createMemoryClient({
	common: optimism,
	// TIP: Disabling forking will speed up tevm
	fork: {
		// @warning we may face throttling using the public endpoint
		// In production apps consider using `loadBalance` and `rateLimit` transports
		transport: http('https://mainnet.optimism.io')({}),
	},
})

// addresses and abis must be as const for tevm types
// const address = `0x${"0420".repeat(10)}` as const;

/**
 * Updates the account information by fetching it with `tevmGetAccount`
 * Will fetch all storage and account values
 * @param {Address} address The contract address to fetch the account information for
 * @returns {Promise<void>}
 */
async function updateAccounts(address: Address) {
	const account = await memoryClient.tevmGetAccount({
		address,
		throwOnFail: false,
	})
	if (account.errors) throw account.errors
	console.log(account) // console log the account to get familiar with what properties are on it
	document.querySelector('#address')!.innerHTML = address
	document.querySelector('#nonce')!.innerHTML = String(account.nonce)
	document.querySelector('#balance')!.innerHTML = String(account.balance)

	// Update contract account info
	const contractAccount = await memoryClient.tevmGetAccount({
		address,
		throwOnFail: false,
		returnStorage: true,
	})
	if (contractAccount.errors) throw contractAccount.errors

	const header = document.querySelector('#contractInfoHeader')!
	const info = document.querySelector('#contractInfoRow')!

	header.innerHTML = `<tr>Address</tr>
  <tr>deplyedBytecode</tr>
  ${Object.keys(contractAccount.storage ?? []).map((storageSlot) => `<tr>${storageSlot}</tr>`)}
  `

	info.innerHTML = `<tr>${contractAccount.address}</tr>
  <tr>${contractAccount.deployedBytecode}</tr>
  ${Object.values(contractAccount.storage ?? []).map((storageValue) => `<tr>${storageValue}</tr>`)}
  `
}

/**
 * Runs the app demonstrating basic tevm features
 * More features are demonstrated in the `counter.spec.ts` file
 */
async function runApp() {
	// Initialize the html
	app.innerHTML = `<div id="status">initializing...</div>
<div id="blocknumber"></div>
<div>
  Address: <span id="address"></span>
</div>
<div>
  Nonce: <span id="nonce"></span>
</div>
<div>
  Balance: <span id="balance"></span>
</div>
<h1>Counter contract</h1>

<!-- Contract info -->
<table border="1" id="contractInfo">
    <thead>
        <tr id="contractInfoHeader">
            <!-- We will fill this in in js -->
        </tr>
    </thead>
    <tbody>
        <tr id="contractInfoRow">
            <!-- We will fill this in in js -->
        </tr>
    </tbody>
</table>
`

	// Update the status as tevm chugs along
	const status = app.querySelector('#status')!

	status.innerHTML = 'Initializing memory client...'

	// this isn't necessary to explicitly await readyness as other actions will wait for it implicitly
	await memoryClient.tevmReady()

	status.innerHTML = 'Fetching block number...'

	/**
	 * Tevm supports most viem Public and Test actions
	 * All wil lbe supported when 1.0.0 is released
	 */
	const blockNumber = await memoryClient.getBlockNumber()
	document.querySelector('#blocknumber')!.innerHTML = `ForkBlock: ${blockNumber}`

	status.innerHTML = 'Deploying contract...'

	const initialValue = 420n
	/**
	 * The two main ways to deploy a contract are `tevmSetAccount` and `tevmDeploy`
	 * `tevmDeploy` deploys a contract with it's constructor bytecode
	 */
	const deployResult = await memoryClient.tevmDeploy({
		from: prefundedAccounts[0],
		abi: SimpleContract.abi,
		// make sure to use bytecode rather than deployedBytecode since we are deploying
		bytecode: SimpleContract.bytecode,
		args: [initialValue],
	})
	if (deployResult.errors) throw deployResult.errors

	status.innerHTML = `Mining contract deployment tx ${deployResult.txHash} for contract ${deployResult.createdAddress}...`

	/**
	 * `tevmMine` mines the next block
	 */
	await memoryClient.tevmMine()

	status.innerHTML = `updating ui to reflect newly mined tx ${deployResult.txHash} deploying contract ${deployResult.createdAddress}...`

	/**
	 * These TevmContract objects are typesafe ways to use Tevm and Viem api.
	 * They can be generated by the tevm compiler from importing solidity or manually using `createContract`
	 */
	const deployedContract = SimpleContract.withAddress(deployResult.createdAddress as Address)

	status.innerHTML = 'Querying contract with tevmContract...'

	/**
	 * Viem methods like `readContract` can be used to interact with tevm.
	 * Tevm also offers powerful `tevmCall`, and ``tevmContract` methods to make calls with additional functionality
	 * such as sending the unsigned call as a impersonated transaction or modifying call depth or msg.sender and more.`
	 */
	const contractResult = await memoryClient.tevmContract(deployedContract.read.get())
	if (contractResult.errors) throw contractResult.errors
	console.log(contractResult.rawData) // returns the raw data returned by evm
	console.log(contractResult.data) // returns the decoded data. Should be the initial value we set
	console.log(contractResult.executionGasUsed) // returns the execution gas used (won't include the data cost or base fee)
	// console log the entire result to become familiar with what all gets returned

	const newValue = 10_000n
	status.innerHTML = `Current value ${contractResult.data}. Changing value to ${newValue}`

	// just like tevmCall we can write with `createTransaction: true`
	// remember the default `from` address is `prefundedAccounts[0]` when not specified!
	const writeResult = await memoryClient.tevmContract({
		createTransaction: 'on-success',
		...deployedContract.write.set(newValue),
	})

	status.innerHTML = `Current value ${contractResult.data}. Changing value to ${newValue}. Mining tx ${writeResult.txHash}`

	const mineResult = await memoryClient.tevmMine()

	/**
	 * Deomonstrating another viem method `getTransactionReceipt`
	 */
	const receipt = await memoryClient.getTransactionReceipt({
		hash: writeResult.txHash as Hex,
	})
	console.log(receipt)

	status.innerHTML = `Value changed in block ${mineResult.blockHashes?.join(',')}. Updating storage in html...`

	// now let's refresh the account information to update storage
	await updateAccounts(deployResult.createdAddress as Address)
	status.innerHTML = 'done'
}

runApp()

/**
 * See `counter.spec.ts` for more advanced features
 */
