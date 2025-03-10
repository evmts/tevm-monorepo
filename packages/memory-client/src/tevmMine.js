import { mineHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmMine` action for viem.
 * Mines blocks in TEVM.
 *
 * This function allows you to mine blocks in the TEVM, which is necessary for applying pending transactions
 * to the canonical head state and advancing the blockchain. When you make state-changing calls or send 
 * transactions, they need to be mined in a block to update the chain's state.
 * 
 * The result of mining includes an array of block hashes of the mined blocks.
 *
 * You can customize the mining process with the `blockCount` and `interval` parameters:
 * - `blockCount`: The number of blocks to mine. Defaults to 1.
 * - `interval`: The interval between block timestamps in seconds. Defaults to 1.
 *
 * Note: By default, TEVM operates in manual mining mode, requiring explicit calls to the mine function.
 * You can configure automatic mining in `createMemoryClient` or `createTevmTransport` options.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').MineParams} [params] - Optional parameters for mining blocks.
 * @returns {Promise<import('@tevm/actions').MineResult>} The result of mining blocks, including an array of block hashes.
 *
 * @example
 * ```typescript
 * import { tevmMine } from 'tevm/actions'
 * import { createClient, http } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) },
 *     mining: { // Optional mining configuration
 *       mode: 'manual', // 'auto' | 'interval' | 'manual' | 'mempool'
 *     },
 *   }),
 *   chain: optimism,
 * })
 *
 * async function example() {
 *   // Send a transaction (in manual mode, this isn't yet mined)
 *   const tx = await client.sendTransaction({
 *     account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *     to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
 *     value: 1000000000000000000n,
 *   })
 *   
 *   // Mine a single block to include the transaction
 *   const result = await tevmMine(client)
 *   console.log('Mined block hash:', result.blockHashes[0])
 *   
 *   // Transaction is now confirmed - can get receipt
 *   const receipt = await client.getTransactionReceipt({ hash: tx })
 *   console.log('Transaction confirmed in block:', receipt.blockNumber)
 *
 *   // Mine 5 more blocks with a 10 second interval between each block
 *   const resultWithParams = await tevmMine(client, { blockCount: 5, interval: 10 })
 *   console.log('Mined block hashes:', resultWithParams.blockHashes)
 *   console.log('New block number:', await client.getBlockNumber())
 * }
 *
 * example()
 * ```
 *
 * @example
 * ```typescript
 * // Using with memory client and contract deployment
 * import { createMemoryClient } from 'tevm'
 * import { SimpleStorage } from './SimpleStorage.sol'
 *
 * const client = createMemoryClient({
 *   mining: { mode: 'manual' }
 * })
 *
 * async function example() {
 *   // Deploy a contract
 *   const deployResult = await client.deployContract(SimpleStorage)
 *   console.log('Deployment transaction hash:', deployResult.hash)
 *   
 *   // Mine the block to complete the contract deployment
 *   const mineResult = await client.mine()
 *   console.log('Contract deployed in block:', mineResult.blockHashes[0])
 *   
 *   // Now we can interact with the deployed contract
 *   const contract = SimpleStorage.withAddress(deployResult.address)
 *   await contract.write.set(42n)
 *   
 *   // Mine another block to apply the state change
 *   await client.mine()
 *   
 *   // Read the updated value
 *   const value = await contract.read.get()
 *   console.log('Stored value:', value) // 42n
 * }
 *
 * example()
 * ```
 * 
 * @throws Will throw if the TEVM node is not properly initialized.
 * @throws Will throw if `blockCount` is negative or not a number.
 *
 * @see [MineParams](https://tevm.sh/reference/tevm/actions/type-aliases/mineparams/) for options reference.
 * @see [MineResult](https://tevm.sh/reference/tevm/actions/type-aliases/mineresult/) for return values reference.
 * @see [Mining Modes](https://tevm.sh/learn/mining/) for information about different mining modes.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmMine = async (client, params) => {
	return mineHandler(client.transport.tevm)(params)
}
