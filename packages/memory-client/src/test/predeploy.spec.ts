import { expect, test } from 'bun:test'
import { createScript } from '@tevm/contract'
import { definePredeploy } from '@tevm/predeploys'
import { EthjsAddress, hexToBytes, toBytes } from '@tevm/utils'
import { formatAbi } from '@tevm/utils'
import { createMemoryClient } from '../createMemoryClient.js'
import { DaiContract } from '../test/DaiContract.sol.js'

test('Call predeploy from TypeScript', async () => {
	const { abi, deployedBytecode } = DaiContract
	const formatted = formatAbi(abi)
	const contract = createScript({
		bytecode: '0x420',
		humanReadableAbi: formatted,
		name: 'ExamplePredeploy',
		deployedBytecode: deployedBytecode,
	} as const)

	const predeployAddress = `0x${'12'.repeat(20)}` as const
	const predeploy = definePredeploy({
		address: predeployAddress,
		contract,
	})

	const tevm = createMemoryClient({
		customPredeploys: [predeploy],
	})

	// Predeploy Contract exists in vm
	expect(
		await (await tevm.getVm()).stateManager.getContractCode(new EthjsAddress(hexToBytes(predeployAddress))),
	).toEqual(toBytes(deployedBytecode))

	// Test predeploy contract call
	const res = await tevm.contract(predeploy.contract.withAddress(predeploy.address).read.balanceOf(predeploy.address))

	expect(res.errors).toEqual(undefined as any)
	expect(res.data).toBe(0n)
	expect(res.executionGasUsed).toBe(2447n)
	expect(res.logs).toEqual([])
})
