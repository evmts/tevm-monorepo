import type { EVMts } from '../evmts.js';
import type { Log } from '@ethereumjs/evm';
import type { Abi } from 'abitype';
import { type Address, type DecodeFunctionResultReturnType, type EncodeFunctionDataParameters } from 'viem';
/**
 * EVMts action to execute a call on a contract
 */
export type RunContractCallAction<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string> = EncodeFunctionDataParameters<TAbi, TFunctionName> & {
    contractAddress: Address;
    caller?: Address;
    gasLimit?: bigint;
};
export type RunContractCallError = Error;
export type RunContractCallResult<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string> = {
    data: DecodeFunctionResultReturnType<TAbi, TFunctionName>;
    gasUsed: BigInt;
    logs: Log[];
};
export declare const runContractCallHandler: <TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string>(evmts: EVMts, { abi, args, functionName, caller, contractAddress, gasLimit, }: RunContractCallAction<TAbi, TFunctionName>) => Promise<RunContractCallResult<TAbi, TFunctionName>>;
//# sourceMappingURL=runContractCall.d.ts.map