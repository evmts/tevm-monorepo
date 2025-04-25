import { createAddress } from '@tevm/address'
import { type TevmNode, createTevmNode } from '@tevm/node'
import { parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'

// These issues happens both in `debugTraceBlockJsonRpcProcedure` and `debugTraceTransactionJsonRpcProcedure`,
// but are globally applicable.
//
// First issue:
// What happens is that the state root is not available for the parent block, which is the one we just mined.
// This happens only in very specific conditions. Each of these tests will:
// 1. Run one or multiple transactions, with various parameters that will trigger the issue or not
// 2. Mine the block
// 3. Get the parent block, and check if its state root is available
// -> a. works when we specify origin or from, no matter how many txs we ran in the parent block
// -> b. fails if we don't specify origin or from AND run 2 txs or more
// -> c. ... but the latter will work if it's only one tx ran from the default (non-specified) account
// -> d. fails if the balance of the caller was set too high? threshold here is pretty inconsistent
//
// Second issue:
// What happens is that mining the block itself will fail with a balance error.
// Each of these tests will:
// 1. Run one or multiple transactions, with various parameters that will trigger the issue or not
// 2. Attempt to mine the block
// -> a. fails whatever the parameters are if we specify skipBalance: true
// -> b. fails if the balance of the caller was set to 0 (which is probably the expected behavior)
// -> c. but works if we set the balance of the caller to just 1 or more
// -> ... which is weird, because 1 would not be enough, and at some point if it becomes too high
// -> ... it will later trigger the first issue (see at 3.d)
describe('mineHandler parent state root issue', () => {
	describe('Retrieving the parent state root', () => {
		const mineAndTestParentStateRoot = async (client: TevmNode) => {
			await mineHandler(client)({ blockCount: 1 })

			const vm = await client.getVm()
			const block = await vm.blockchain.getCanonicalHeadBlock()
			const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)
			const hasParentStateRoot = await vm.stateManager.hasStateRoot(parentBlock.header.stateRoot)
			expect(hasParentStateRoot).toBe(true)
		}

		it('✅ works when origin or from is specified', async () => {
			const client = createTevmNode()
			const user = createAddress(1)

			await setAccountHandler(client)({
				address: user.toString(),
				balance: 100n,
				nonce: 0n,
			})

			await callHandler(client)({
				blockTag: 'pending',
				origin: user.toString(),
				to: user.toString(),
				value: 1n,
				addToMempool: true,
			})
			await callHandler(client)({
				blockTag: 'pending',
				origin: user.toString(),
				to: user.toString(),
				value: 1n,
				addToMempool: true,
			})

			await mineAndTestParentStateRoot(client)
		})

		it('✅ ... no matter how many calls we make', async () => {
			const client = createTevmNode()
			const user = createAddress(1)

			await setAccountHandler(client)({
				address: user.toString(),
				balance: 100n,
				nonce: 0n,
			})

			for (let i = 0; i < 10; i++) {
				await callHandler(client)({
					blockTag: 'pending',
					origin: user.toString(),
					to: user.toString(),
					value: 1n,
					addToMempool: true,
				})
			}

			await mineAndTestParentStateRoot(client)
		})

		it("✅ ... also works if it's just one call without specifying origin or from (will use the default account)", async () => {
			const client = createTevmNode()
			const user = createAddress(1)

			await setAccountHandler(client)({
				address: user.toString(),
				balance: 0n,
				nonce: 0n,
			})

			await callHandler(client)({
				blockTag: 'pending',
				// no origin specified so it will be the default account
				to: user.toString(),
				value: 1n,
				addToMempool: true,
			})

			await mineAndTestParentStateRoot(client)
		})

		// AssertionError: expected false to be true
		it('❌ ... but fails if we do not specify origin or from (will use the default account) AND run 2 txs or more', async () => {
			const client = createTevmNode()
			const user = createAddress(1)

			await setAccountHandler(client)({
				address: user.toString(),
				balance: 0n,
				nonce: 0n,
			})

			for (let i = 0; i < 2; i++) {
				await callHandler(client)({
					blockTag: 'pending',
					// no origin specified so it will be the default account
					to: user.toString(),
					value: 1n,
					addToMempool: true,
				})
			}

			await mineAndTestParentStateRoot(client)
		})

		// AssertionError: expected false to be true
		it("❌ ... and also fails if balance is set too high (threshold slighly depends on the amount of calls in a way I can't quite pinpoint)", async () => {
			const client = createTevmNode()
			const user = createAddress(1)

			await setAccountHandler(client)({
				address: user.toString(),
				balance: parseEther('10'),
				nonce: 0n,
			})

			await callHandler(client)({
				blockTag: 'pending',
				origin: user.toString(),
				to: user.toString(),
				value: 1n,
				addToMempool: true,
			})
			await callHandler(client)({
				blockTag: 'pending',
				origin: user.toString(),
				to: user.toString(),
				value: 1n,
				addToMempool: true,
			})

			await mineAndTestParentStateRoot(client)
		})
	})

	describe('Balance inconsistencies that make mining fail', () => {
		// InsufficientFunds: sender doesn't have enough funds to send tx.
		it('❌ fails if we specify skipBalance=true whatever the balance we set', async () => {
			const client = createTevmNode()
			const user = createAddress(1)

			await setAccountHandler(client)({
				address: user.toString(),
				balance: 100n,
				nonce: 0n,
			})

			await callHandler(client)({
				blockTag: 'pending',
				origin: user.toString(),
				to: user.toString(),
				value: 1n,
				addToMempool: true,
				skipBalance: true,
			})

			await mineHandler(client)({ blockCount: 1 })
		})

		// InsufficientBalance: Insufficientbalance: Account 0x0000000000000000000000000000000000000001 attempted
		// to create a transaction with zero eth. Consider adding eth to account or using a different from or origin address
		it('❌ (probably expected) fails if we set the balance of the caller to zero', async () => {
			const client = createTevmNode()
			const user = createAddress(1)
			await setAccountHandler(client)({
				address: user.toString(),
				balance: 0n,
				nonce: 0n,
			})

			await callHandler(client)({
				blockTag: 'pending',
				origin: user.toString(),
				to: user.toString(),
				value: 1n,
				addToMempool: true,
			})
			await callHandler(client)({
				blockTag: 'pending',
				origin: user.toString(),
				to: user.toString(),
				value: 1n,
				addToMempool: true,
			})

			await mineHandler(client)({ blockCount: 1 })
		})

		it('✅ ... but works if we set the balance of the caller to just 1 or more', async () => {
			const client = createTevmNode()
			const user = createAddress(1)
			await setAccountHandler(client)({
				address: user.toString(),
				balance: 1n,
				nonce: 0n,
			})

			await callHandler(client)({
				blockTag: 'pending',
				origin: user.toString(),
				to: user.toString(),
				value: 1n,
				addToMempool: true,
			})
			await callHandler(client)({
				blockTag: 'pending',
				origin: user.toString(),
				to: user.toString(),
				value: 1n,
				addToMempool: true,
			})

			await mineHandler(client)({ blockCount: 1 })
		})
	})
})
