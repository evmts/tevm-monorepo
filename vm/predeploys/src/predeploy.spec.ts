import { definePredeploy } from './definePredeploy.js'
import { DaiContract } from './test/DaiContract.sol.js'
import { Address } from '@ethereumjs/util'
import { createTevmContract } from '@tevm/contract'
import { formatAbi } from 'abitype'
import { expect, test } from 'bun:test'

// There is a more complete usage example in the @tevm/vm package
test('definePredeploy should define a predeploy', async () => {
	const { abi, deployedBytecode } = DaiContract
	const formatted = formatAbi(abi)
	const contract = createTevmContract({
		bytecode: undefined,
		humanReadableAbi: formatted,
		name: 'ExamplePredeploy',
		deployedBytecode: deployedBytecode,
	})

	const predeployAddress = '0x0420042004200420042004200420042004200420'
	const predeploy = definePredeploy({
		address: predeployAddress,
		contract,
	})

	expect(predeploy.address).toEqual(predeployAddress)
	expect(predeploy.contract).toEqual(contract)
	expect(predeploy.predeploy().address).toEqual(
		Address.fromString(predeployAddress),
	)
})
