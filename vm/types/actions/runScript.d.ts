import type { EVMts } from '../evmts.js';
import { type RunContractCallResult } from './runContractCall.js';
import type { Abi } from 'abitype';
import { type Address, type EncodeFunctionDataParameters, type Hex } from 'viem';
/**
 * EVMts action to deploy and execute a script or contract
 */
export type RunScriptAction<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string> = EncodeFunctionDataParameters<TAbi, TFunctionName> & {
    bytecode: Hex;
    caller?: Address;
};
export type RunScriptError = Error;
export type RunScriptResult<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string> = RunContractCallResult<TAbi, TFunctionName>;
export declare const runScriptHandler: <TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string>(evmts: EVMts, { bytecode, args, abi, caller, functionName, }: RunScriptAction<TAbi, TFunctionName>) => Promise<RunScriptResult<TAbi, TFunctionName>>;
//# sourceMappingURL=runScript.d.ts.map