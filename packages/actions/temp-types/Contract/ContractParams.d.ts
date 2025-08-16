import type { ContractFunctionName, EncodeFunctionDataParameters, Hex } from '@tevm/utils';
import type { BaseCallParams } from '../BaseCall/BaseCallParams.js';
import type { Abi, Address } from '../common/index.js';
/**
 * Parameters to execute a call on a contract with TEVM.
 *
 * This type combines the parameters required for encoding function data with additional call parameters.
 *
 * @template TAbi - The ABI type.
 * @template TFunctionName - The function name type from the ABI.
 * @template TThrowOnFail - The type indicating whether to throw on failure.
 *
 * @example
 * ```typescript
 * import { createClient } from 'viem'
 * import { contractHandler } from 'tevm/actions'
 * import { Abi } from 'viem/utils'
 *
 * const client = createClient({ transport: http('https://mainnet.optimism.io')({}) })
 *
 * const params: ContractParams<Abi, 'myFunction'> = {
 *   abi: [...], // ABI array
 *   functionName: 'myFunction',
 *   args: [arg1, arg2],
 *   to: '0x123...',
 *   from: '0x123...',
 *   gas: 1000000n,
 *   gasPrice: 1n,
 *   skipBalance: true,
 * }
 *
 * const contractCall = contractHandler(client)
 * const res = await contractCall(params)
 * console.log(res)
 * ```
 *
 * @see {@link https://tevm.sh/reference/tevm/memory-client/functions/tevmContract | tevmContract}
 * @see {@link BaseCallParams}
 * @see {@link EncodeFunctionDataParameters}
 */
export type ContractParams<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>, TThrowOnFail extends boolean = boolean> = EncodeFunctionDataParameters<TAbi, TFunctionName> & BaseCallParams<TThrowOnFail> & ({
    /**
     * The address of the contract to call.
     */
    readonly to: Address;
    /**
     * The deployed bytecode to execute at the contract address.
     * If not provided, the code will be fetched from state.
     */
    readonly deployedBytecode?: Hex;
    /**
     * Alias for deployedBytecode.
     */
    readonly code?: Hex;
} | {
    /**
     * The address of the contract to call.
     */
    readonly to?: Address;
    /**
     * The deployed bytecode to execute at the contract address.
     * If not provided, the code will be fetched from state.
     */
    readonly deployedBytecode?: Hex;
    /**
     * Alias for deployedBytecode.
     */
    readonly code: Hex;
} | {
    /**
     * The address of the contract to call.
     */
    readonly to?: Address;
    /**
     * The deployed bytecode to execute at the contract address.
     * If not provided, the code will be fetched from state.
     */
    readonly deployedBytecode: Hex;
    /**
     * Alias for deployedBytecode.
     */
    readonly code?: Hex;
});
//# sourceMappingURL=ContractParams.d.ts.map