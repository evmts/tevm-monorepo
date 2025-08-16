import type { Abi, ContractConstructorArgs, EncodeDeployDataParameters } from '@tevm/utils';
import type { BaseCallParams } from '../BaseCall/BaseCallParams.js';
import type { Hex } from '../common/index.js';
/**
 * Defines the parameters used for deploying a contract on TEVM.
 * This type extends the base call parameters used for typical TEVM calls,
 * with the addition of deployment-specific settings. By default, `createTransaction`
 * is set to true, because deployments result in state changes that need to be mined.
 *
 * The `salt` parameter supports the use of CREATE2, allowing for deterministic address deployment.
 *
 * @example
 * ```typescript
 * import { createClient } from 'viem'
 * import { deployHandler } from 'tevm/actions'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   })
 * })
 *
 * const deployParams = {
 *   bytecode: '0x6000366000...',
 *   abi: [{
 *     inputs: [],
 *     stateMutability: 'nonpayable',
 *     type: 'constructor'
 *   }],
 *   args: [],
 *   salt: '0x0000...0001',  // Optional CREATE2 salt for deterministic deployment
 *   from: '0xYourAccountAddress',
 *   gas: 1000000n,
 *   createTransaction: true
 * }
 *
 * const result = await deployHandler(client)(deployParams)
 * console.log('Deployed contract address:', result.createdAddress)
 * ```
 *
 * @template TThrowOnFail - Indicates whether the function should throw on failure.
 * @template TAbi - The ABI type, typically including constructor definitions.
 * @template THasConstructor - Determines whether the ABI includes a constructor.
 * @template TAllArgs - Types of the constructor arguments for the deployment.
 */
export type DeployParams<TThrowOnFail extends boolean = boolean, TAbi extends Abi | readonly unknown[] = Abi, THasConstructor = TAbi extends Abi ? Abi extends TAbi ? true : [Extract<TAbi[number], {
    type: 'constructor';
}>] extends [never] ? false : true : true, TAllArgs = ContractConstructorArgs<TAbi>> = Omit<BaseCallParams<TThrowOnFail>, 'to'> & {
    /**
     * An optional CREATE2 salt, if deploying with CREATE2 for a predictable contract address.
     */
    readonly salt?: Hex;
} & EncodeDeployDataParameters<TAbi, THasConstructor, TAllArgs>;
//# sourceMappingURL=DeployParams.d.ts.map