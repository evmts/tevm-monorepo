import { createContract } from '@tevm/contract'
import { definePredeploy } from '@tevm/predeploys'
import { EthjsAddress, hexToBytes, toBytes } from '@tevm/utils'
import { formatAbi } from '@tevm/utils'
import { expect, test } from 'vitest'
import { createMemoryClient } from '../createMemoryClient.js'
import { DaiContract } from '../test/DaiContract.sol.js'

test('Call predeploy from TypeScript', async () => {
	const { abi, deployedBytecode } = DaiContract
	const formatted = formatAbi(abi)
	const contract = createContract({
		bytecode: '0x420',
		humanReadableAbi: formatted,
		name: 'ExamplePredeploy',
		deployedBytecode: deployedBytecode,
		address: `0x${'12'.repeat(20)}` as const,
	} as const)

	const predeploy = definePredeploy(contract)

	const tevm = createMemoryClient({
		loggingLevel: 'debug',
		customPredeploys: [predeploy],
	})

	await tevm.tevmReady()

	// Predeploy Contract exists in vm
	expect(
		await (await tevm.transport.tevm.getVm()).stateManager.getContractCode(
			new EthjsAddress(hexToBytes(contract.address)),
		),
	).toEqual(toBytes(deployedBytecode))

	// Test predeploy contract call
	const res = await tevm.tevmContract(predeploy.contract.read.balanceOf(contract.address))

	expect(res.errors).toEqual(undefined as any)
	expect(res.data).toBe(0n)
	expect(res.executionGasUsed).toBe(2447n)
	expect(res.logs).toEqual([])
})
