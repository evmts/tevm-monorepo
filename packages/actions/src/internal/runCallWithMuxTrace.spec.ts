import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { encodeFunctionData, hexToBytes } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { runCallWithMuxTrace } from './runCallWithMuxTrace.js'

const ERC20_ADDRESS = `0x${'1'.repeat(40)}` as const
const ERC20_BYTECODE = TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

describe('runCallWithMuxTrace', () => {
	let client: ReturnType<typeof createTevmNode>

	beforeEach(async () => {
		client = createTevmNode()
		await client.ready()
	})

	it('default struct-log tracer reports the full per-step gasCost (including dynamic gas) and 1-based depth', async () => {
		await setAccountHandler(client)({
			address: ERC20_ADDRESS,
			deployedBytecode: ERC20_BYTECODE,
		})

		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(
				encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'balanceOf',
					args: [ERC20_ADDRESS],
				}),
			),
			gasLimit: 16784800n,
			to: createAddress(ERC20_ADDRESS),
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithMuxTrace(vm, client.logger, params, { default: {} })

		const structLogs = (result.trace as any).default.structLogs as Array<{
			op: string
			gas: bigint
			gasCost: bigint
			depth: number
		}>

		expect(structLogs.length).toBeGreaterThan(0)

		// gasCost for each step must equal the gas actually consumed (drop in remaining gas to the next step).
		// The bug reported only the static base fee, understating any dynamic-gas opcode.
		for (let i = 0; i < structLogs.length - 1; i++) {
			const current = structLogs[i]
			const next = structLogs[i + 1]
			if (current && next && current.depth === next.depth) {
				expect(current.gasCost).toBe(current.gas - next.gas)
			}
		}

		// geth uses 1-based depth: top-level frame must be depth 1, never 0.
		for (const log of structLogs) {
			expect(log.depth).toBeGreaterThanOrEqual(1)
		}
		expect(structLogs[0]?.depth).toBe(1)
	})
})
