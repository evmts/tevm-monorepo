import { contractHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmContract` action for viem.
 * Interacts with a contract method call using TEVM.
 *
 * Internally, `tevmContract` wraps `tevmCall`. It automatically encodes and decodes the contract call parameters and results, as well as any revert messages.
 * It provides a convenient interface similar to viem's `readContract`/`writeContract` actions.
 *
 * Use this function to:
 * - Execute read methods on contracts (view/pure functions)
 * - Execute write methods (state-changing functions)
 * - Simulate transactions without actually committing them to the state
 * - Get detailed execution results including gas usage, logs, and return data
 *
 * @type {import('./TevmContractType.js').TevmContract}
 * @example
 * ```typescript
 * import { tevmContract } from 'tevm/actions'
 * import { createClient, http, parseAbi } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * })
 *
 * // Prepare contract ABI
 * const abi = parseAbi([
 *   'function balanceOf(address owner) view returns (uint256)',
 *   'function transfer(address to, uint256 amount) returns (bool)',
 * ])
 *
 * async function example() {
 *   // Read call example - view function
 *   const balanceResult = await tevmContract(client, {
 *     to: '0x4200000000000000000000000000000000000042', // contract address
 *     abi,
 *     functionName: 'balanceOf',
 *     args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
 *   })
 *   console.log('Balance:', balanceResult.data)
 *
 *   // Write call example - state-changing function
 *   const transferResult = await tevmContract(client, {
 *     to: '0x4200000000000000000000000000000000000042', // contract address
 *     abi,
 *     functionName: 'transfer',
 *     args: ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 1000000000000000000n],
 *   })
 *   console.log('Transfer success:', transferResult.data)
 *   console.log('Gas used:', transferResult.executionResult.gasUsed)
 * }
 *
 * example()
 * ```
 *
 * @example
 * ```typescript
 * // Using with a contract imported directly via Tevm bundler
 * import { tevmContract } from 'tevm/actions'
 * import { createMemoryClient } from 'tevm'
 * import { SimpleStorage } from './SimpleStorage.sol'
 *
 * const client = createMemoryClient()
 *
 * async function example() {
 *   // First deploy the contract or set up its state
 *   await client.setAccount({
 *     address: '0x0000000000000000000000000000000000000123',
 *     deployedBytecode: SimpleStorage.deployedBytecode,
 *   })
 *
 *   // Create a contract instance with a specific address
 *   const contract = SimpleStorage.withAddress('0x0000000000000000000000000000000000000123')
 *
 *   // Call read method using tevmContract
 *   const getValue = await tevmContract(client, contract.read.get())
 *   console.log('Current value:', getValue.data)
 *
 *   // Call write method using tevmContract
 *   const setValue = await tevmContract(client, contract.write.set(42n))
 *   console.log('Set value success:', setValue.data)
 *
 *   // In manual mining mode, you need to mine the transaction
 *   await client.mine()
 *
 *   // Verify the value was updated
 *   const newValue = await tevmContract(client, contract.read.get())
 *   console.log('New value:', newValue.data) // Should be 42n
 * }
 *
 * example()
 * ```
 *
 * @throws Will throw if the contract address is invalid.
 * @throws Will throw if the ABI doesn't contain the specified function.
 * @throws Will throw if the contract execution reverts.
 * @throws Will throw if the arguments don't match the function signature.
 *
 * @see [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) for options reference.
 * @see [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) for return values reference.
 * @see [BaseCallParams](https://tevm.sh/reference/tevm/actions/type-aliases/basecallparams-1/) for the base call parameters.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmContract = async (client, params) => {
	// TODO this shouldn't need to be any any
	return contractHandler(client.transport.tevm)(/** @type {any}*/ (params))
}
