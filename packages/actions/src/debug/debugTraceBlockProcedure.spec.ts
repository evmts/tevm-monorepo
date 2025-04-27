import { createAddress } from '@tevm/address'
import { SimpleContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { assert, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { debugTraceBlockJsonRpcProcedure } from './debugTraceBlockProcedure.js'
import { bytesToHex } from '@tevm/utils'

describe('debugTraceBlockJsonRpcProcedure', () => {
	it.only('should trace transactions in a block and return the expected result', async () => {
		const client = createTevmNode({/* loggingLevel: 'debug', */ miningConfig: {type: "manual"}})
		const procedure = debugTraceBlockJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

    // Run the tx that will be included in the traced block
		// * If blockTag is not pending, each tx is placed in a block, and mining will just mine one block
		// * the state root for each block will exist (because each block is correctly manually mined)
		// * If blockTag IS pending, with each new tx a block is created with the previous txs and the new one
		// * and mining will mine a block with all txs, and will correctly have its state root.
		await contractHandler(client)({ // 1
			addToMempool: true,
      blockTag: 'pending',
			...contract.write.set(1312n),
		})
		await contractHandler(client)({ // 2
			addToMempool: true,
      blockTag: 'pending',
			...contract.write.set(1312n),
		})
		await contractHandler(client)({ // 3
			addToMempool: true,
      blockTag: 'pending',
			...contract.write.set(1312n),
		})
		await contractHandler(client)({ // 4
			addToMempool: true,
      blockTag: 'pending',
			...contract.write.set(1312n),
		})
    await mineHandler(client)({ blockCount: 1 })


    const vm = await client.getVm()
    vm.blockchain.blocksByNumber
    const blocks = [await vm.blockchain.getCanonicalHeadBlock()]
    while ((blocks[blocks.length - 1]?.header.number ?? 0n) > 0n) {
      const block = blocks[blocks.length - 1]
      if (!block) break
      const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)
      blocks.push(parentBlock)
    }
    console.log("latest block", {
      number: blocks[0]?.header.number,
      transactions: blocks[0]?.transactions.length,
      stateRoot: bytesToHex(blocks[0]?.header.stateRoot ?? new Uint8Array()),
      hasStateRoot: blocks[0]?.header.stateRoot && await vm.stateManager.hasStateRoot(blocks[0]?.header.stateRoot),
    })
    blocks.slice(1).forEach(async (block, index) => {
      console.log(`block -${index}`, {
        number: block?.header.number,
        transactions: block?.transactions.length,
        stateRoot: bytesToHex(block?.header.stateRoot),
        hasStateRoot: block?.header.stateRoot && await vm.stateManager.hasStateRoot(block?.header.stateRoot),
      })
    })
    // console.log(vm.blockchain.blocksByNumber)

    // console.log(
    //   await procedure({
    //     		jsonrpc: '2.0',
    //     		method: 'debug_traceBlock',
    //     		params: [
    //     			{
    //     				blockTag: 'latest',
    //     				tracer: 'callTracer',
    //     			},
    //     		],
    //     		id: 1,
    //     	})
    // )
		// expect(
		// 	await procedure({
		// 		jsonrpc: '2.0',
		// 		method: 'debug_traceBlock',
		// 		params: [
		// 			{
		// 				blockTag: 'latest',
		// 				tracer: 'callTracer',
		// 			},
		// 		],
		// 		id: 1,
		// 	}),
		// ).toMatchSnapshot()
	})

	it('should trace transactions in a block and return the expected result with prestateTracer', async () => {
		const client = createTevmNode()
		const procedure = debugTraceBlockJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

    // Run the tx that will be included in the traced block
    await contractHandler(client)({
			// blockTag: 'pending',
			addToBlockchain: true,
			...contract.write.set(42n),
		})

		// without diffMode
		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlock',
				params: [
					{
						blockTag: 'latest',
						tracer: 'prestateTracer',
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()

		// with diffMode
		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceBlock',
				params: [
					{
						blockTag: 'latest',
						tracer: 'prestateTracer',
						tracerConfig: {
							diffMode: true,
						},
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()
	})
})
