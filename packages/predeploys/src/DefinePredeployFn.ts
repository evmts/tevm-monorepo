import type { Contract } from '@tevm/contract'
import { type Address, type Hex } from '@tevm/utils'
import { type Predeploy } from './Predeploy.js'

/**
 * Defines a predeploy contract to use in the tevm vm
 * @example
 * ```ts
 * import { definePredeploy } from 'tevm/predeploys'
 * import { createMemoryClient } from 'tevm/vm'
 * import { createContract } from 'tevm/contract'
 *
 * const predeploy = definePredeploy({
 *   address: `0x${'23'.repeat(20)}`,
 *   contract: createContract({
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
export type DefinePredeployFn = <TName extends string, THumanReadableAbi extends readonly string[]>(
	contract: Contract<TName, THumanReadableAbi, Address, Hex, Hex>,
) => Predeploy<TName, THumanReadableAbi>
