import { Predeploy } from './Predeploy.js'
import { getAddress } from '@tevm/utils'

/**
 * Defines a predeploy contract to use in the tevm vm
 * @example
 * ```ts
 * import { definePredeploy } from 'tevm/predeploys'
 * import { createMemoryClient } from 'tevm/vm'
 * import { createScript } from 'tevm/contract'
 *
 * const predeploy = definePredeploy({
 *   address: `0x${'23'.repeat(20)}`,
 *   contract: createScript({
 *     name: 'PredeployExample',
 *     humanReadableAbi: ['function foo() external pure returns (uint256)'],
 *     bytecode: '0x608060405234801561001057600080fd5b5061012f806100206000396000f3fe608060405260043610610041576000357c0100',
 *     deployedBytecode: '0x608060405260043610610041576000357c010000
 *   })
 * })
 *
 * const vm = createMemoryClient({
 *  predeploys: [predeploy.predeploy()],
 * })
 * ```
 */
export const definePredeploy = <
	TName extends string,
	THumanReadableAbi extends readonly string[],
>({
	contract,
	address,
}: Pick<
	Predeploy<TName, THumanReadableAbi>,
	'contract' | 'address'
>): Predeploy<TName, THumanReadableAbi> => {
	class PredeployImplementation extends Predeploy<TName, THumanReadableAbi> {
		// the exta withAddress is a hack. The type for Predeploy is not correctly including a contract with an address
		// TODO we should export contract with address as a type from @tevm/contract
		contract = {
			...contract.withAddress(address),
			withAddress: contract.withAddress,
		}
		address = getAddress(address)
	}
	return new PredeployImplementation()
}
