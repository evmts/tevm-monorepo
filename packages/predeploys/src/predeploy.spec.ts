import { expect, test } from 'bun:test'
import { createContract } from '@tevm/contract'
import { EthjsAddress } from '@tevm/utils'
import { formatAbi } from '@tevm/utils'
import { definePredeploy } from './definePredeploy.js'
import { DaiContract } from './test/DaiContract.sol.js'

// There is a more complete usage example in the @tevm/vm package
test('definePredeploy should define a predeploy', async () => {
	const { abi, deployedBytecode } = DaiContract
	const formatted = formatAbi(abi)
	const predeployAddress = '0x0420042004200420042004200420042004200420'
	const contract = createContract({
		bytecode: '0x420',
		humanReadableAbi: formatted,
		name: 'ExamplePredeploy',
		deployedBytecode: deployedBytecode,
		address: predeployAddress,
	})

	const predeploy = definePredeploy(contract)

	expect(predeploy.contract.address).toEqual(predeployAddress)
	const expectedContract = contract.withAddress(predeployAddress)
	expect(predeploy.contract).toMatchObject(expectedContract)
	expect(predeploy.predeploy().address).toEqual(EthjsAddress.fromString(predeployAddress))
})
