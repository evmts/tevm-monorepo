import { createTevm } from '../createTevm.js'
import { DaiContract } from '../test/DaiContract.sol.js'
import { Address, hexToBytes, toBytes } from '@ethereumjs/util'
import { createTevmContract } from '@tevm/contract'
import { definePredeploy } from '@tevm/predeploys'
import { formatAbi } from 'abitype'
import { expect, test } from 'bun:test'

test('Call predeploy from TypeScript', async () => {
	const { abi, deployedBytecode } = DaiContract
	const formatted = formatAbi(abi)
	const contract = createTevmContract({
		bytecode: '0x420',
		humanReadableAbi: formatted,
		name: 'ExamplePredeploy',
		deployedBytecode: deployedBytecode,
	} as const)

	const predeployAddress = '0x0420042004200420042004200420042004200420'
	const predeploy = definePredeploy({
		address: predeployAddress,
		contract,
	})

	const tevm = await createTevm({
		customPredeploys: [predeploy],
	})

	// Predeploy Contract exists in vm
	expect(
		await tevm._evm.stateManager.getContractCode(
			new Address(hexToBytes(predeployAddress)),
		),
	).toEqual(toBytes(deployedBytecode))

	// Test predeploy contract call
	const res = await tevm.contract({
		to: predeploy.address,
		...predeploy.contract.read.balanceOf(
			'0xf0d4c12a5768d806021f80a262b4d39d26c58b8d',
		),
	})

	expect(res.data).toBe(0n)
	expect(res.executionGasUsed).toBe(2447n)
	expect(res.logs).toEqual([])
})
